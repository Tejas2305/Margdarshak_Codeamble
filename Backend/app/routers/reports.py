from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.category import Category
from app.models.user import User
from app.models.report import Report, ReportVote
from app.models.road_segment import RoadSegment
from app.schemas.report import (
    ReportCreate,
    ReportResponse,
    VoteRequest,
    VoteResponse,
)
from app.utils.auth import get_current_user
from app.services.scoring_service import (
    calculate_computed_severity,
    calculate_report_confidence,
)
from app.services.spatial_service import find_nearest_road_segment
from app.services.dirty_segment_service import recalculate_dirty_segments
from app.services.osrm_updater_service import trigger_debounced_osrm_update

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/categories")
async def get_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Category).order_by(Category.category_id)
    )
    categories = result.scalars().all()

    if not categories:
        default_cats = [
            ("Got Robbed", "Phone, wallet, bag, chain, or other belongings were stolen.", 60.0, 80.0),
            ("Harassed", "Catcalling, unwanted comments, staring, or someone making you uncomfortable.", 60.0, 80.0),
            ("Being Followed", "Someone kept following or repeatedly approaching you.", 70.0, 85.0),
            ("Physical Attack", "Someone was physically attacked or assaulted.", 80.0, 95.0),
            ("Accident", "Road accident, vehicle crash, or traffic-related incident.", 50.0, 75.0),
            ("Too Dark", "Poor street lighting or very dark area.", 30.0, 50.0),
            ("Dog Alert", "Aggressive stray dogs or other animals nearby.", 30.0, 55.0),
            ("Not The Vibes", "The place felt unsafe or suspicious, but nothing specific happened.", 20.0, 45.0),
            ("Rough Roads", "Potholes, broken roads, damaged footpaths, or unsafe road conditions.", 25.0, 45.0),
            ("Public Nuisance", "Drunk people, loud groups, fights, or public nuisance.", 35.0, 60.0),
            ("Empty Area", "Empty or deserted area with very few people around.", 35.0, 55.0),
            ("Natural Hazard", "Flooding, landslides, storm damage, fallen trees, or other natural hazards.", 40.0, 65.0),
            ("Suspicious Activity", "Someone or something looked suspicious and could pose a safety risk.", 40.0, 60.0),
            ("Other", "Any safety concern that does not fit the above categories.", 30.0, 50.0),
        ]
        for name, desc, s_min, s_max in default_cats:
            cat = Category(name=name, description=desc, severity_min=s_min, severity_max=s_max)
            db.add(cat)
        await db.commit()
        result = await db.execute(select(Category).order_by(Category.category_id))
        categories = result.scalars().all()

    return [
        {
            "category_id": c.category_id,
            "name": c.name,
            "description": c.description,
            "severity_min": getattr(c, "severity_min", 50.0),
            "severity_max": getattr(c, "severity_max", 70.0),
        }
        for c in categories
    ]


@router.post("/create", response_model=ReportResponse, status_code=201)
async def create_report(
    request: ReportCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cat_result = await db.execute(
        select(Category).where(Category.category_id == request.category_id)
    )
    category = cat_result.scalar_one_or_none()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    s_min = getattr(category, "severity_min", 50.0)
    s_max = getattr(category, "severity_max", 70.0)
    computed_sev = calculate_computed_severity(s_min, s_max, request.user_rating)

    nearest_seg = await find_nearest_road_segment(db, request.latitude, request.longitude)
    seg_id = nearest_seg.segment_id if nearest_seg else None

    if nearest_seg:
        nearest_seg.is_dirty = True

    new_report = Report(
        user_id=current_user.user_id,
        category_id=request.category_id,
        road_segment_id=seg_id,
        user_rating=request.user_rating,
        computed_severity=computed_sev,
        description=request.description,
        latitude=request.latitude,
        longitude=request.longitude,
        status="PENDING",
        upvotes=0,
        downvotes=0,
        confidence_score=0.5
    )

    db.add(new_report)
    await db.commit()
    await db.refresh(new_report)

    await recalculate_dirty_segments(db)
    await trigger_debounced_osrm_update()

    return ReportResponse(
        report_id=new_report.report_id,
        user_id=new_report.user_id,
        category_id=new_report.category_id,
        category_name=category.name,
        user_rating=new_report.user_rating,
        computed_severity=new_report.computed_severity,
        description=new_report.description,
        latitude=new_report.latitude,
        longitude=new_report.longitude,
        status=new_report.status,
        upvotes=new_report.upvotes,
        downvotes=new_report.downvotes,
        confidence_score=new_report.confidence_score,
        created_at=new_report.created_at
    )


@router.post("/{report_id}/vote", response_model=VoteResponse)
async def vote_report(
    report_id: int,
    request: VoteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if request.vote_type not in (1, -1):
        raise HTTPException(status_code=400, detail="vote_type must be 1 (upvote) or -1 (downvote)")

    rep_result = await db.execute(select(Report).where(Report.report_id == report_id))
    report = rep_result.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    vote_result = await db.execute(
        select(ReportVote).where(
            ReportVote.report_id == report_id,
            ReportVote.user_id == current_user.user_id
        )
    )
    existing_vote = vote_result.scalar_one_or_none()

    if existing_vote:
        raise HTTPException(
            status_code=409,
            detail="User has already voted on this report"
        )

    new_vote = ReportVote(
        report_id=report_id,
        user_id=current_user.user_id,
        vote_type=request.vote_type
    )
    db.add(new_vote)

    if request.vote_type == 1:
        report.upvotes += 1
    else:
        report.downvotes += 1

    report.confidence_score = calculate_report_confidence(report.upvotes, report.downvotes)

    if report.road_segment_id:
        seg_result = await db.execute(
            select(RoadSegment).where(RoadSegment.segment_id == report.road_segment_id)
        )
        segment = seg_result.scalar_one_or_none()
        if segment:
            segment.is_dirty = True

    await db.commit()
    await db.refresh(report)

    await recalculate_dirty_segments(db)
    await trigger_debounced_osrm_update()

    return VoteResponse(
        report_id=report.report_id,
        upvotes=report.upvotes,
        downvotes=report.downvotes,
        confidence_score=report.confidence_score,
        message="Vote recorded successfully"
    )


@router.get("/my-reports")
async def get_my_reports(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offset = (page - 1) * limit
    result = await db.execute(
        select(Report)
        .where(Report.user_id == current_user.user_id)
        .order_by(Report.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    reports = result.scalars().all()

    return [
        {
            "report_id": r.report_id,
            "category_id": r.category_id,
            "user_rating": r.user_rating,
            "computed_severity": r.computed_severity,
            "description": r.description,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "status": r.status,
            "upvotes": r.upvotes,
            "downvotes": r.downvotes,
            "confidence_score": r.confidence_score,
            "created_at": r.created_at,
        }
        for r in reports
    ]


@router.get("/nearby")
async def get_nearby_reports(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: float = Query(5000.0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Report).order_by(Report.created_at.desc()).limit(50)
    )
    reports = result.scalars().all()

    return [
        {
            "report_id": r.report_id,
            "category_id": r.category_id,
            "computed_severity": r.computed_severity,
            "description": r.description,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "status": r.status,
            "confidence_score": r.confidence_score,
            "created_at": r.created_at,
        }
        for r in reports
    ]

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

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

    # Seed default categories if database table is empty
    if not categories:
        default_cats = [
            ("Theft", "Mobile, vehicle, or item theft", 50.0, 70.0),
            ("Harassment", "Physical or verbal harassment", 60.0, 80.0),
            ("Assault", "Physical violence or assault", 80.0, 95.0),
            ("Poor Lighting", "Dark or poorly lit streets", 30.0, 50.0),
            ("Suspicious Activity", "Suspicious gathering or behavior", 40.0, 60.0),
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


@router.post("/create", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    payload: ReportCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch category to get min/max severity range
    cat_result = await db.execute(
        select(Category).where(Category.category_id == payload.category_id)
    )
    category = cat_result.scalars().first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    s_min = getattr(category, "severity_min", 50.0)
    s_max = getattr(category, "severity_max", 70.0)
    computed_sev = calculate_computed_severity(s_min, s_max, payload.user_rating)

    # Locate target road segment
    nearest_seg = await find_nearest_road_segment(db, payload.latitude, payload.longitude)
    seg_id = nearest_seg.segment_id if nearest_seg else None

    # Mark segment as dirty if bound
    if nearest_seg:
        nearest_seg.is_dirty = True

    new_report = Report(
        user_id=None if payload.is_anonymous else current_user.user_id,
        category_id=payload.category_id,
        road_segment_id=seg_id,
        user_rating=payload.user_rating,
        computed_severity=computed_sev,
        description=payload.description,
        latitude=payload.latitude,
        longitude=payload.longitude,
        photos=payload.photos,
        is_anonymous=payload.is_anonymous,
        status="PENDING",
        upvotes=0,
        downvotes=0,
        confidence_score=0.5
    )

    db.add(new_report)
    await db.commit()
    await db.refresh(new_report)

    # Trigger dirty segment recalculation
    await recalculate_dirty_segments(db)

    return ReportResponse(
        report_id=new_report.report_id,
        category_id=new_report.category_id,
        category_name=category.name,
        user_rating=new_report.user_rating,
        computed_severity=new_report.computed_severity,
        description=new_report.description,
        latitude=new_report.latitude,
        longitude=new_report.longitude,
        photos=new_report.photos,
        is_anonymous=new_report.is_anonymous,
        status=new_report.status,
        upvotes=new_report.upvotes,
        downvotes=new_report.downvotes,
        confidence_score=new_report.confidence_score,
        created_at=new_report.created_at
    )


@router.post("/{report_id}/vote", response_model=VoteResponse)
async def vote_report(
    report_id: int,
    payload: VoteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if payload.vote_type not in (1, -1):
        raise HTTPException(status_code=400, detail="vote_type must be 1 (upvote) or -1 (downvote)")

    # Fetch report
    rep_result = await db.execute(select(Report).where(Report.report_id == report_id))
    report = rep_result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    # Check for existing vote by user (one-time voting)
    vote_result = await db.execute(
        select(ReportVote).where(
            ReportVote.report_id == report_id,
            ReportVote.user_id == current_user.user_id
        )
    )
    existing_vote = vote_result.scalars().first()
    if existing_vote:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User has already voted on this report"
        )

    # Insert vote record
    new_vote = ReportVote(
        report_id=report_id,
        user_id=current_user.user_id,
        vote_type=payload.vote_type
    )
    db.add(new_vote)

    # Increment upvotes / downvotes
    if payload.vote_type == 1:
        report.upvotes += 1
    else:
        report.downvotes += 1

    # Recalculate confidence
    report.confidence_score = calculate_report_confidence(report.upvotes, report.downvotes)

    # Mark associated segment dirty
    if report.road_segment_id:
        seg_result = await db.execute(
            select(RoadSegment).where(RoadSegment.segment_id == report.road_segment_id)
        )
        segment = seg_result.scalars().first()
        if segment:
            segment.is_dirty = True

    await db.commit()
    await db.refresh(report)

    # Recalculate dirty segments
    await recalculate_dirty_segments(db)

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
    radius: float = Query(5000.0, description="Radius in meters"),
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

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.emergency_contact import EmergencyContact
from app.models.sos_event import SosEvent
from app.models.user import User
from app.schemas.sos import (
    SosTriggerRequest,
    SosResponse,
    SosHistoryResponse
)
from app.utils.auth import get_current_user
from app.utils.location import generate_google_maps_url
from app.utils.sms import send_sms


router = APIRouter(
    prefix="/sos",
    tags=["SOS"]
)


@router.post(
    "/trigger",
    response_model=SosResponse
)
async def trigger_sos(
    request: SosTriggerRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Save SOS
    sos = SosEvent(
        user_id=current_user.user_id,
        latitude=request.latitude,
        longitude=request.longitude,
        address=request.address,
        battery_percentage=request.battery_percentage,
        status="ACTIVE"
    )

    db.add(sos)

    await db.commit()

    await db.refresh(sos)

    # Generate Google Maps URL
    google_maps_url = generate_google_maps_url(
        sos.latitude,
        sos.longitude
    )

    # Fetch Emergency Contacts
    result = await db.execute(
        select(EmergencyContact).where(
            EmergencyContact.user_id == current_user.user_id
        )
    )

    contacts = result.scalars().all()

    # SMS Message
    message = f"""
🚨 SOS ALERT

{current_user.first_name} {current_user.last_name} has triggered an SOS.

📍 Location:
{google_maps_url}

🔋 Battery:
{sos.battery_percentage}%

Please contact immediately.
"""


    # Send SMS to all contacts
    for contact in contacts:

        send_sms(
            phone_number=contact.phone_number,
            message=message
        )

    return SosResponse(
        message="SOS triggered successfully",
        sos_id=sos.sos_id,
        status=sos.status,
        created_at=sos.created_at,
        google_maps_url=google_maps_url
    )


@router.get(
    "/history",
    response_model=List[SosHistoryResponse]
)
async def get_sos_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    result = await db.execute(
        select(SosEvent)
        .where(SosEvent.user_id == current_user.user_id)
        .order_by(SosEvent.created_at.desc())
    )

    sos_events = result.scalars().all()

    response = []

    for sos in sos_events:

        response.append(
            SosHistoryResponse(
                sos_id=sos.sos_id,
                latitude=sos.latitude,
                longitude=sos.longitude,
                address=sos.address,
                battery_percentage=sos.battery_percentage,
                status=sos.status,
                created_at=sos.created_at,
                google_maps_url=generate_google_maps_url(
                    sos.latitude,
                    sos.longitude
                )
            )
        )

    return response
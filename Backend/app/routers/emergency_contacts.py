from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.emergency_contact import EmergencyContact
from app.models.user import User
from app.schemas.user import (
    EmergencyContactCreate,
    EmergencyContactUpdate,
)
from app.utils.auth import get_current_user


router = APIRouter(
    prefix="/user/emergency-contacts",
    tags=["EmergencyContacts"],
)


@router.get("")
async def list_contacts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(EmergencyContact).where(EmergencyContact.user_id == current_user.user_id)
    )
    contacts = result.scalars().all()

    return [
        {
            "contact_id": c.contact_id,
            "name": c.name,
            "phone_number": c.phone_number,
        }
        for c in contacts
    ]


@router.post("")
async def create_contact(
    request: EmergencyContactCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = await db.scalar(
        select(EmergencyContact).where(
            EmergencyContact.user_id == current_user.user_id,
            EmergencyContact.phone_number == request.phone_number,
        )
    )

    if existing is not None:
        raise HTTPException(status_code=400, detail="Contact with this phone number already exists")

    new = EmergencyContact(
        user_id=current_user.user_id,
        name=request.name,
        phone_number=request.phone_number,
    )

    db.add(new)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Contact with this phone number already exists")

    await db.refresh(new)

    return {"message": "Contact added", "contact_id": new.contact_id}


@router.put("/{contact_id}")
async def update_contact(
    request: EmergencyContactUpdate,
    contact_id: int = Path(..., ge=1),
    # request: EmergencyContactUpdate = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(EmergencyContact).where(EmergencyContact.contact_id == contact_id)
    )
    contact = result.scalar_one_or_none()

    if contact is None or contact.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Contact not found")

    if request.name is not None:
        contact.name = request.name

    if request.phone_number is not None:
        contact.phone_number = request.phone_number


    await db.commit()
    await db.refresh(contact)

    return {"message": "Contact updated", "contact_id": contact.contact_id}


@router.delete("/{contact_id}")
async def delete_contact(
    contact_id: int = Path(..., ge=1),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(EmergencyContact).where(EmergencyContact.contact_id == contact_id)
    )
    contact = result.scalar_one_or_none()

    if contact is None or contact.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Contact not found")

    await db.delete(contact)
    await db.commit()

    return {"message": "Contact deleted"}

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

from app.models.user import User
from app.models.email_otp import EmailOTP

from app.schemas.user import (
    UpdateProfileRequest,
    ChangePasswordRequest,
    SendOTPRequest,
    VerifyOTPRequest,
    VerifyEmailOTPRequest,
)
from sqlalchemy import delete, select
from app.utils.auth import get_current_user
from app.utils.password import verify_password, hash_password

from app.utils.email_service import (
    generate_otp,
    send_email_otp,
)

from app.utils.phone_verification import (
    send_phone_otp,
    verify_phone_otp,
)
router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me")
async def get_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "user_id": current_user.user_id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "role_id": current_user.role_id,
        "email_verified": current_user.email_verified,
        "phone_verified": current_user.phone_verified,
        "account_status": current_user.account_status
    }

@router.put("/me")
async def update_profile(
    request: UpdateProfileRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if request.first_name is not None:
        current_user.first_name = request.first_name

    if request.last_name is not None:
        current_user.last_name = request.last_name

    if request.phone_number is not None:
        current_user.phone_number = request.phone_number

    if request.date_of_birth is not None:
        current_user.date_of_birth = request.date_of_birth

    if request.profile_picture is not None:
        current_user.profile_picture = request.profile_picture

    await db.commit()
    await db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "phone_number": current_user.phone_number,
            "date_of_birth": current_user.date_of_birth,
            "profile_picture": current_user.profile_picture
        }
    }

@router.put("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(request.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    current_user.password_hash = hash_password(request.new_password)

    await db.commit()

    return {
        "message": "Password changed successfully"
    }

@router.delete("/me")
async def delete_account(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await db.delete(current_user)
    await db.commit()

    return {
        "message": "Account deleted successfully"
    }

@router.post("/send-phone-otp")
async def send_phone_otp_api(request: SendOTPRequest):
    send_phone_otp(request.phone_number)

    return {
        "message": "OTP sent successfully"
    }

@router.post("/verify-phone-otp")
async def verify_phone_otp_endpoint(
    request: VerifyOTPRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    is_verified = verify_phone_otp(
        current_user.phone_number,
        request.otp
    )

    if not is_verified:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    # Update database
    current_user.phone_verified = True

    await db.commit()

    await db.refresh(current_user)

    return {
        "message": "Phone number verified successfully"
    }

@router.post("/send-email-otp")
async def send_email_otp_api(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Generate a new OTP
    otp = generate_otp()

    # OTP expiry time (10 minutes)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    # Delete any previous OTP for this user
    await db.execute(
        delete(EmailOTP).where(
            EmailOTP.user_id == current_user.user_id
        )
    )

    # Create new OTP record
    new_otp = EmailOTP(
        user_id=current_user.user_id,
        otp=otp,
        expires_at=expires_at
    )

    # Save OTP to database
    db.add(new_otp)
    await db.commit()

    # Send email
    status = send_email_otp(
        current_user.email,
        otp
    )

    # Check if email was sent
    if status != 202:
        raise HTTPException(
            status_code=500,
            detail="Failed to send email OTP"
        )

    return {
        "message": "OTP sent successfully"
    }

@router.post("/verify-email-otp")
async def verify_email_otp(
    request: VerifyEmailOTPRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Find OTP
    result = await db.execute(
        select(EmailOTP).where(
            EmailOTP.user_id == current_user.user_id,
            EmailOTP.otp == request.otp
        )
    )

    otp_record = result.scalar_one_or_none()

    if otp_record is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    # Check expiry
    if otp_record.expires_at < datetime.now(timezone.utc):
        await db.delete(otp_record)
        await db.commit()

        raise HTTPException(
            status_code=400,
            detail="OTP has expired"
        )

    # Verify email
    current_user.email_verified = True

    # Delete OTP
    await db.delete(otp_record)

    await db.commit()
    await db.refresh(current_user)

    return {
        "message": "Email verified successfully"
    }
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.schemas.user import ChangePasswordRequest
from app.utils.password import verify_password, hash_password
from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    UpdateProfileRequest,
    ChangePasswordRequest,
    SendOTPRequest,
    VerifyOTPRequest,
)
from app.utils.email_verification import (
    send_email_otp,
    verify_email_otp
)
from app.utils.auth import get_current_user
from app.models.user import User
from app.utils.auth import get_current_user
from app.schemas.user import (
    UpdateProfileRequest,
    ChangePasswordRequest,
    SendOTPRequest,
    VerifyOTPRequest,
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


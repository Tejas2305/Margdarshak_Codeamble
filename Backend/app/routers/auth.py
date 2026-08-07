import hashlib
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from jose import JWTError, jwt
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.password_reset import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.config import ALGORITHM, REFRESH_TOKEN_EXPIRE_DAYS, SECRET_KEY
from app.database import get_db
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    AuthResponse,
    RefreshTokenRequest,
    LogoutRequest,
)
from app.utils.password import hash_password, verify_password
from app.utils.auth import create_access_token, create_refresh_token
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, delete

from app.models.password_reset_otp import PasswordResetOTP
from app.models.refresh_token import RefreshToken

from app.schemas.auth import (
    ForgotPasswordRequest,
    VerifyForgotPasswordOTPRequest,
    ResetPasswordRequest,
)

from app.utils.email_service import (
    generate_otp,
    send_email_otp,
)

from app.utils.password import hash_password
# Create router FIRST
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Then define routes
def _hash_refresh_token(refresh_token: str) -> str:
    return hashlib.sha256(refresh_token.encode("utf-8")).hexdigest()


async def _store_refresh_token(
    db: AsyncSession,
    user_id: int,
    refresh_token: str,
):
    await db.execute(
        delete(RefreshToken).where(RefreshToken.user_id == user_id)
    )

    refresh_token_record = RefreshToken(
        user_id=user_id,
        token_hash=_hash_refresh_token(refresh_token),
        expires_at=datetime.now(timezone.utc) + timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        ),
        is_revoked=False,
    )

    db.add(refresh_token_record)


@router.post("/register")
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):

    result = await db.execute(
        select(User).where(User.email == request.email)
    )

    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(request.password)

    new_user = User(
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        phone_number=request.phone_number,
        password_hash=hashed_password,
        role_id=1,
        email_verified=False,
        phone_verified=False,
        account_status="ACTIVE"
    )

    db.add(new_user)

    await db.flush()

    await db.commit()

    await db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.user_id
    }

@router.post("/login", response_model=AuthResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User).where(User.email == form_data.username)
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": str(user.user_id),
            "email": user.email
        }
    )

    refresh_token = create_refresh_token(
        data={
            "sub": str(user.user_id),
            "email": user.email
        }
    )

    await _store_refresh_token(db, user.user_id, refresh_token)
    await db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=AuthResponse)
async def refresh_access_token(
    payload: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid refresh token"
    )

    try:
        decoded_token = jwt.decode(
            payload.refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        token_type = decoded_token.get("type")
        user_id = decoded_token.get("sub")

        if token_type != "refresh" or user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    token_hash = _hash_refresh_token(payload.refresh_token)

    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.is_revoked.is_(False),
            RefreshToken.expires_at > datetime.now(timezone.utc),
        )
    )

    stored_token = result.scalar_one_or_none()

    if stored_token is None:
        raise credentials_exception

    user_result = await db.execute(
        select(User).where(User.user_id == int(user_id))
    )
    user = user_result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    new_access_token = create_access_token(
        data={
            "sub": str(user.user_id),
            "email": user.email,
        }
    )
    new_refresh_token = create_refresh_token(
        data={
            "sub": str(user.user_id),
            "email": user.email,
        }
    )

    await _store_refresh_token(db, user.user_id, new_refresh_token)
    await db.commit()

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }

@router.post("/logout")
async def logout(
    payload: LogoutRequest,
    db: AsyncSession = Depends(get_db)
):
    token_hash = _hash_refresh_token(payload.refresh_token)

    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == token_hash
        )
    )

    refresh_token = result.scalar_one_or_none()

    if refresh_token is None:
        raise HTTPException(
            status_code=404,
            detail="Refresh token not found"
        )

    refresh_token.is_revoked = True

    await db.commit()

    return {
        "message": "Logged out successfully"
    }

@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db)
):
    # Find user
    result = await db.execute(
        select(User).where(User.email == request.email)
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Generate OTP
    otp = generate_otp()

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    # Delete previous OTP
    await db.execute(
        delete(PasswordResetOTP).where(
            PasswordResetOTP.user_id == user.user_id
        )
    )

    # Save new OTP
    db.add(
        PasswordResetOTP(
            user_id=user.user_id,
            otp=otp,
            expires_at=expires_at
        )
    )

    await db.commit()

    # Send email
    status = send_email_otp(
        user.email,
        otp
    )

    if status != 202:
        raise HTTPException(
            status_code=500,
            detail="Failed to send OTP"
        )

    return {
        "message": "OTP sent successfully"
    }

@router.post("/verify-forgot-password-otp")
async def verify_forgot_password_otp(
    request: VerifyForgotPasswordOTPRequest,
    db: AsyncSession = Depends(get_db)
):
    # Find user
    result = await db.execute(
        select(User).where(User.email == request.email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Find OTP
    result = await db.execute(
        select(PasswordResetOTP).where(
            PasswordResetOTP.user_id == user.user_id,
            PasswordResetOTP.otp == request.otp
        )
    )

    otp_record = result.scalar_one_or_none()

    if not otp_record:
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

    return {
        "message": "OTP verified successfully"
    }

@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
):
    # Find user
    result = await db.execute(
        select(User).where(User.email == request.email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Find OTP
    result = await db.execute(
        select(PasswordResetOTP).where(
            PasswordResetOTP.user_id == user.user_id,
            PasswordResetOTP.otp == request.otp
        )
    )

    otp_record = result.scalar_one_or_none()

    if not otp_record:
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

    # Update password
    user.password_hash = hash_password(request.new_password)

    # Delete used OTP
    await db.delete(otp_record)

    # Revoke all refresh tokens
    await db.execute(
        delete(RefreshToken).where(
            RefreshToken.user_id == user.user_id
        )
    )

    await db.commit()

    return {
        "message": "Password reset successfully. Please login again."
    }
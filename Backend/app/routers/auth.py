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


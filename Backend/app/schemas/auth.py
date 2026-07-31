from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class RegisterRequest(BaseModel):
    first_name: str
    last_name : str
    email:EmailStr
    phone_number:Optional[str]= None
    password:str
    date_of_birth:Optional[date]= None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"

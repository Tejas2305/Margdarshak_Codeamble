from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date


class UpdateProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    profile_picture: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class EmergencyContactBase(BaseModel):
    name: str
    phone_number: str = Field(pattern=r"^\+?[1-9]\d{1,14}$")


class EmergencyContactCreate(EmergencyContactBase):
    pass


class EmergencyContactUpdate(BaseModel):
    contact_id: int
    name: Optional[str] = None
    phone_number: str = Field(pattern=r"^\+?[1-9]\d{1,14}$")


class EmergencyContactResponse(BaseModel):
    contact_id: int
    name: str
    phone_number: str

    class Config:
        from_attributes = True

class SendOTPRequest(BaseModel):
    phone_number: str

class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str
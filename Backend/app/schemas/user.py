from pydantic import BaseModel, EmailStr
from typing import Optional


class UpdateProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    profile_picture: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class EmergencyContactBase(BaseModel):
    name: str
    phone_number: str


class EmergencyContactCreate(EmergencyContactBase):
    pass


class EmergencyContactUpdate(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None



class EmergencyContactResponse(BaseModel):
    contact_id: int
    name: str
    phone_number: str


    class Config:
        orm_mode = True
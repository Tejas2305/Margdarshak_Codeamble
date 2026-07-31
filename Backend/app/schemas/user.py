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
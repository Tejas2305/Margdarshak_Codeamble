from pydantic import BaseModel, EmailStr


class VerifyEmailOTPRequest(BaseModel):
    email: EmailStr
    otp: str
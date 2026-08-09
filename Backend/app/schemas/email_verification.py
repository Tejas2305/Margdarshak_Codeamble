from pydantic import BaseModel, EmailStr


class SendEmailOTPRequest(BaseModel):
    email: EmailStr


class VerifyEmailOTPRequest(BaseModel):
    email: EmailStr
    otp: str

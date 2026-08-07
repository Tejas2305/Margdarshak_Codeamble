from pydantic import BaseModel


class VerifyEmailOTPRequest(BaseModel):
    otp: str
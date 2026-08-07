from twilio.rest import Client
from app.config import (
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_VERIFY_SERVICE_SID,
)

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def send_phone_otp(phone_number: str):
    verification = client.verify.v2.services(
        TWILIO_VERIFY_SERVICE_SID
    ).verifications.create(
        to=phone_number,
        channel="sms"
    )
    return verification.status


def verify_phone_otp(phone_number: str, otp: str):
    verification_check = client.verify.v2.services(
        TWILIO_VERIFY_SERVICE_SID
    ).verification_checks.create(
        to=phone_number,
        code=otp
    )

    return verification_check.status == "approved"
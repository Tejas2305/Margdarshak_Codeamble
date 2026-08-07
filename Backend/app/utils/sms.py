from twilio.rest import Client

from app.config import (
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER
)

client = Client(
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN
)


def send_sms(
    phone_number: str,
    message: str
):

    client.messages.create(
        body=message,
        from_=TWILIO_PHONE_NUMBER,
        to=phone_number
    )

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_phone_otp(phone_number):
    client.verify.v2.services(
        TWILIO_VERIFY_SERVICE_SID
    ).verifications.create(
        to=phone_number,
        channel="sms"
    )

def verify_phone_otp(phone_number, otp):
    result = client.verify.v2.services(
        TWILIO_VERIFY_SERVICE_SID
    ).verification_checks.create(
        to=phone_number,
        code=otp
    )

    return result.status == "approved"
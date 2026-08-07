import random

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from app.config import (
    SENDGRID_API_KEY,
    FROM_EMAIL,
    FROM_NAME,
)


def generate_otp():
    return str(random.randint(100000, 999999))


def send_email_otp(email: str, otp: str):

    message = Mail(
        from_email=(FROM_EMAIL, FROM_NAME),
        to_emails=email,
        subject="Verify Your Email",
        html_content=f"""
        <html>
            <body>
                <h2>Margdarshak Email Verification</h2>

                <p>Hello,</p>

                <p>Your verification code is:</p>

                <h1>{otp}</h1>

                <p>This OTP is valid for <b>10 minutes</b>.</p>

                <p>If you didn't request this email, please ignore it.</p>
            </body>
        </html>
        """
    )

    sg = SendGridAPIClient(SENDGRID_API_KEY)

    response = sg.send(message)

    return response.status_code
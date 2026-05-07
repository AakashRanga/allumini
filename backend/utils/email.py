import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import secrets

load_dotenv()

SMTP_EMAIL = os.getenv("smtp_email")
SMTP_PASSWORD = os.getenv("smtp_password")
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

def send_otp_email(to_email: str, otp: str, name: str):
    """Send OTP verification email"""
    subject = "Verify your email - SACRED Alumni"

    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #0A66C2; text-align: center;">SACRED Alumni Association</h2>
            <p>Hello <strong>{name}</strong>,</p>
            <p>Thank you for registering with SACRED Alumni. Please verify your email address by entering the OTP below:</p>
            <div style="background-color: #f0f9ff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <h1 style="color: #0A66C2; font-size: 36px; letter-spacing: 5px; margin: 0;">{otp}</h1>
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't register, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px; text-align: center;">SACRED Alumni Association</p>
        </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        return True, None
    except Exception as e:
        return False, str(e)


def generate_reset_token():
    """Generate a secure random token for password reset"""
    return secrets.token_urlsafe(32)


def send_password_reset_email(to_email: str, token: str, name: str):
    """Send password reset email with secure button link"""
    subject = "Reset your password - SACRED Alumni"

    # Secure reset link - token is in the URL but validated server-side
    reset_link = f"{FRONTEND_URL}/auth/reset-password?token={token}"

    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #0A66C2; text-align: center;">SACRED Alumni Association</h2>
            <p>Hello <strong>{name}</strong>,</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" style="background-color: #0A66C2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Reset Password
                </a>
            </div>
            <p style="color: #666; font-size: 14px;">This link will expire in 15 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <span style="color: #0A66C2; word-break: break-all;">{reset_link}</span>
            </p>
            <p style="color: #666; font-size: 12px; text-align: center;">SACRED Alumni Association</p>
        </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        return True, None
    except Exception as e:
        return False, str(e)
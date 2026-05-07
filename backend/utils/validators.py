import re
from werkzeug.security import generate_password_hash

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
CONTACT_REGEX = re.compile(r"^[0-9]{10,15}$")

def validate_registration_data(data):
    if not isinstance(data, dict):
        return "Invalid JSON body"

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    contact_number = str(data.get("contact_number", "")).strip()
    academic_details = data.get("academic_details", [])
    specialization = data.get("specialization", "").strip()

    if not name:
        return "Name required"
    if not email or not EMAIL_REGEX.match(email):
        return "Valid email required"
    if not password or len(password) < 8:
        return "Password must be 8+ chars"
    if not CONTACT_REGEX.match(contact_number):
        return "Invalid contact number"
    if not academic_details or not isinstance(academic_details, list):
        return "At least one degree details required"
    if not specialization:
        return "Specialization required"



    return {
        "name": name,
        "email": email,
        "password_hash": generate_password_hash(password),
        "contact_number": contact_number,
        "academic_details": academic_details,
        "specialization": specialization,
    }
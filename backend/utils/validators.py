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


def validate_profile_data(data):
    if not isinstance(data, dict):
        return "Invalid JSON body"

    # Name validation
    if "name" in data:
        name = str(data.get("name", "")).strip()
        if not name:
            return "Name cannot be empty"
        data["name"] = name

    # Contact number validation
    if "contact_number" in data:
        contact_number = str(data.get("contact_number", "")).strip()
        # Clean non-digits
        contact_number = re.sub(r"\D", "", contact_number)
        if not CONTACT_REGEX.match(contact_number):
            return "Contact number must be 10 to 15 digits"
        data["contact_number"] = contact_number

    # Specialization validation
    if "specialization" in data:
        specialization = str(data.get("specialization", "")).strip()
        if not specialization:
            return "Specialization cannot be empty"
        data["specialization"] = specialization

    # Academic details validation
    if "academic_details" in data:
        acad_list = data.get("academic_details")
        if acad_list is not None:
            if not isinstance(acad_list, list):
                return "Academic details must be a list"
            for index, entry in enumerate(acad_list):
                if not isinstance(entry, dict):
                    return f"Academic entry at index {index} is invalid"
                degree = str(entry.get("degree", "")).strip()
                joining_year = str(entry.get("joining_year", "")).strip()
                college_name = str(entry.get("college_name", "")).strip()
                if not degree or not joining_year or not college_name:
                    return f"Degree, Batch (joining year), and College name are required for academic entry {index + 1}"

    # Previous experience validation
    if "previous_experience" in data:
        exp_list = data.get("previous_experience")
        if exp_list is not None:
            if not isinstance(exp_list, list):
                return "Previous experience must be a list"
            
            cleaned_exp = []
            for index, entry in enumerate(exp_list):
                if not isinstance(entry, dict):
                    return f"Experience entry at index {index} is invalid"
                
                company = str(entry.get("company", "")).strip()
                role = str(entry.get("role", "")).strip()
                duration = str(entry.get("duration", "")).strip()
                description = str(entry.get("description", "")).strip()

                # If all are empty, skip it (filter out empty entries)
                if not (company or role or duration or description):
                    continue
                
                # If any is filled, company, role, and duration are required
                if not company:
                    return f"Company name is required for experience entry {index + 1}"
                if not role:
                    return f"Role/Job title is required for experience entry {index + 1}"
                if not duration:
                    return f"Duration is required for experience entry {index + 1}"
                    
                cleaned_exp.append({
                    "company": company,
                    "role": role,
                    "duration": duration,
                    "description": description
                })
            data["previous_experience"] = cleaned_exp

    return data
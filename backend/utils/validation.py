import re

def validate_job_post(data):
    errors = {}
    
    company = data.get("company", "").strip()
    role = data.get("role", "").strip()
    location = data.get("location", "").strip()
    salary = data.get("salary", "").strip()
    description = data.get("description", "").strip()
    apply_link = data.get("applyLink", "") or data.get("apply_link", "")

    if not company:
        errors["company"] = "Company name is required."
    if not role:
        errors["role"] = "Job title/role is required."
    if not location:
        errors["location"] = "Location is required."
    if not salary:
        errors["salary"] = "Salary is required."
    else:
        try:
            val = float(salary)
            if val <= 0:
                errors["salary"] = "Salary must be a valid positive number."
        except ValueError:
            errors["salary"] = "Salary must be a valid number or float."
    if not description:
        errors["description"] = "Job description is required."

    if apply_link and str(apply_link).strip():
        # URL validation regex matching standard domains, ports, and subdirectories
        url_pattern = re.compile(
            r'^(https?://)?'
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'
            r'localhost|'
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'
            r'(?::\d+)?'
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        if not url_pattern.match(str(apply_link).strip()):
            errors["applyLink"] = "Invalid URL format."

    return len(errors) == 0, errors

"""
Sample data insertion script for overall_alumni table
Run this after initializing the database to seed authorized alumni records
"""

from backend.db import execute_query
from backend.models import TABLE_OVERALL_ALUMNI

sample_alumni = [
    {
        "name": "Sarah Johnson",
        "email": "sarah.j@college.edu",
        "mobile": "+1 234 567 8901",
        "degree": "UG",
        "specialization": "Computer Science",
        "batch": 2020,
        "roll_number": "20CS001",
        "institution": "Tech Institute",
        "department": "Computer Science"
    },
    {
        "name": "Michael Chen",
        "email": "michael.c@college.edu",
        "mobile": "+1 234 567 8902",
        "degree": "PG",
        "specialization": "Data Science",
        "batch": 2021,
        "roll_number": "21DS001",
        "institution": "Tech Institute",
        "department": "Data Science"
    },
    {
        "name": "Emily Davis",
        "email": "emily.d@college.edu",
        "mobile": "+1 234 567 8903",
        "degree": "UG",
        "specialization": "Mechanical Engineering",
        "batch": 2022,
        "roll_number": "22ME001",
        "institution": "Tech Institute",
        "department": "Mechanical Engineering"
    },
    {
        "name": "James Wilson",
        "email": "james.w@college.edu",
        "mobile": "+1 234 567 8904",
        "degree": "PG",
        "specialization": "Business Analytics",
        "batch": 2023,
        "roll_number": "23BA001",
        "institution": "Tech Institute",
        "department": "Business Administration"
    },
    {
        "name": "Alex Thompson",
        "email": "alex.t@college.edu",
        "mobile": "+1 234 567 8905",
        "degree": "UG",
        "specialization": "Electrical Engineering",
        "batch": 2024,
        "roll_number": "24EE001",
        "institution": "Tech Institute",
        "department": "Electrical Engineering"
    },
    {
        "name": "Priya Sharma",
        "email": "priya.s@college.edu",
        "mobile": "+1 234 567 8906",
        "degree": "UG",
        "specialization": "Computer Science",
        "batch": 2020,
        "roll_number": "20CS002",
        "institution": "Tech Institute",
        "department": "Computer Science"
    },
    {
        "name": "Robert Martinez",
        "email": "robert.m@college.edu",
        "mobile": "+1 234 567 8907",
        "degree": "PG",
        "specialization": "Artificial Intelligence",
        "batch": 2023,
        "roll_number": "23AI001",
        "institution": "Tech Institute",
        "department": "Artificial Intelligence"
    },
    {
        "name": "Sophia Martinez",
        "email": "sophia.m@college.edu",
        "mobile": "+1 234 567 8908",
        "degree": "PG",
        "specialization": "Artificial Intelligence",
        "batch": 2023,
        "roll_number": "23AI002",
        "institution": "Tech Institute",
        "department": "Artificial Intelligence"
    },
]

def insert_sample_data():
    """Insert sample alumni data into overall_alumni table"""
    
    for alumni in sample_alumni:
        query = f"""
        INSERT INTO `{TABLE_OVERALL_ALUMNI}` 
        (name, email, mobile, degree, specialization, batch, roll_number, institution, department, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'active')
        ON DUPLICATE KEY UPDATE
        mobile = VALUES(mobile),
        specialization = VALUES(specialization),
        updated_at = CURRENT_TIMESTAMP
        """
        
        params = (
            alumni["name"],
            alumni["email"],
            alumni["mobile"],
            alumni["degree"],
            alumni["specialization"],
            alumni["batch"],
            alumni["roll_number"],
            alumni["institution"],
            alumni["department"]
        )
        
        try:
            execute_query(query, params)
            print(f"✓ Inserted: {alumni['name']}")
        except Exception as e:
            print(f"✗ Error inserting {alumni['name']}: {str(e)}")

if __name__ == "__main__":
    print("🔄 Inserting sample alumni data...")
    insert_sample_data()
    print("✅ Sample data insertion completed!")

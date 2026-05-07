DB_NAME = "sacred" 
TABLE_ALUMNI_USERS = "alumni_users"

CREATE_ALUMNI_USERS_TABLE = f"""
CREATE TABLE IF NOT EXISTS `{TABLE_ALUMNI_USERS}` (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL UNIQUE,
    password_hash VARCHAR(255) DEFAULT NULL,
    contact_number VARCHAR(20) DEFAULT NULL UNIQUE,
    academic_details JSON DEFAULT NULL,
    specialization VARCHAR(255) DEFAULT NULL,

    role ENUM("admin", "alumni") DEFAULT "alumni",

    email_verified TINYINT(1) DEFAULT 0,
    email_otp VARCHAR(255) DEFAULT NULL,

    is_approved TINYINT(1) DEFAULT 0,

    password_reset_token VARCHAR(255) DEFAULT NULL,
    token_expiry DATETIME DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
"""
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "127.0.0.1"),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", "12345"),
    "database": os.getenv("MYSQL_DB", "alumni_db"),
    "port": int(os.getenv("MYSQL_PORT", "3308")),
}
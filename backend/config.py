import os
from dotenv import load_dotenv

# Load .env relative to this file's directory (backend/)
base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir, '.env'))

DB_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "127.0.0.1"),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", "12345"),
    "database": os.getenv("MYSQL_DB", "alumni_db"),
    "port": int(os.getenv("MYSQL_PORT", "3308")),
}
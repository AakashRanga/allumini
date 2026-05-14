from flask import Flask, request
from routes.auth import auth_bp
from routes.verification import verification_bp
from routes.posts import posts_bp
from db import get_connection
from models import (
    CREATE_ALUMNI_USERS_TABLE, TABLE_ALUMNI_USERS, 
    CREATE_OVERALL_ALUMNI_TABLE, TABLE_OVERALL_ALUMNI,
    CREATE_JOBS_TABLE, TABLE_JOBS,
    CREATE_ACHIEVEMENTS_TABLE, TABLE_ACHIEVEMENTS
)

app = Flask(__name__)

@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:7777"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,X-Auth-User-Id,X-Auth-Role"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        return response

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:7777"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,X-Auth-User-Id,X-Auth-Role"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response

def get_table_columns(cursor, table_name):
    cursor.execute(f"DESCRIBE `{table_name}`")
    return {row['Field'] for row in cursor.fetchall()}

def parse_columns_from_sql(sql):
    """Parse column definitions from CREATE TABLE SQL"""
    columns = {}
    import re
    # Find content between CREATE TABLE ... ( and ) ENGINE
    start = sql.find('(')
    end = sql.find(') ENGINE')
    if start == -1 or end == -1:
        return columns
    col_section = sql[start+1:end]
    # Split by comma, handling commas inside parentheses (like ENUM)
    parts = []
    depth = 0
    current = ''
    for char in col_section:
        if char == '(':
            depth += 1
            current += char
        elif char == ')':
            depth -= 1
            current += char
        elif char == ',' and depth == 0:
            parts.append(current.strip())
            current = ''
        else:
            current += char
    if current.strip():
        parts.append(current.strip())

    for col in parts:
        if not col or col.upper().startswith(('PRIMARY KEY', 'FOREIGN KEY', 'CONSTRAINT', 'UNIQUE', 'INDEX', 'KEY', 'CHECK')):
            continue
        col_match = re.match(r'`?(\w+)`?\s+(.+)', col)
        if col_match:
            col_name = col_match.group(1)
            col_def = col_match.group(2).rstrip(',')
            columns[col_name] = col_def
    return columns

def init_db():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Create alumni_users table if not exists
    cursor.execute(CREATE_ALUMNI_USERS_TABLE)

    # Auto-migrate: parse expected columns from models.py SQL
    expected_columns = parse_columns_from_sql(CREATE_ALUMNI_USERS_TABLE)
    existing_columns = get_table_columns(cursor, TABLE_ALUMNI_USERS)

    for col_name, col_def in expected_columns.items():
        if col_name not in existing_columns:
            print(f"Adding missing column to {TABLE_ALUMNI_USERS}: {col_name}")
            cursor.execute(f"ALTER TABLE `{TABLE_ALUMNI_USERS}` ADD COLUMN {col_name} {col_def}")

    # Create overall_alumni table if not exists
    cursor.execute(CREATE_OVERALL_ALUMNI_TABLE)

    # Auto-migrate: parse expected columns from models.py SQL
    expected_columns = parse_columns_from_sql(CREATE_OVERALL_ALUMNI_TABLE)
    existing_columns = get_table_columns(cursor, TABLE_OVERALL_ALUMNI)

    for col_name, col_def in expected_columns.items():
        if col_name not in existing_columns:
            print(f"Adding missing column to {TABLE_OVERALL_ALUMNI}: {col_name}")
            cursor.execute(f"ALTER TABLE `{TABLE_OVERALL_ALUMNI}` ADD COLUMN {col_name} {col_def}")

    # Create jobs table if not exists
    cursor.execute(CREATE_JOBS_TABLE)
    expected_columns = parse_columns_from_sql(CREATE_JOBS_TABLE)
    existing_columns = get_table_columns(cursor, TABLE_JOBS)
    for col_name, col_def in expected_columns.items():
        if col_name not in existing_columns:
            print(f"Adding missing column to {TABLE_JOBS}: {col_name}")
            cursor.execute(f"ALTER TABLE `{TABLE_JOBS}` ADD COLUMN {col_name} {col_def}")

    # Create achievements table if not exists
    cursor.execute(CREATE_ACHIEVEMENTS_TABLE)
    expected_columns = parse_columns_from_sql(CREATE_ACHIEVEMENTS_TABLE)
    existing_columns = get_table_columns(cursor, TABLE_ACHIEVEMENTS)
    for col_name, col_def in expected_columns.items():
        if col_name not in existing_columns:
            print(f"Adding missing column to {TABLE_ACHIEVEMENTS}: {col_name}")
            cursor.execute(f"ALTER TABLE `{TABLE_ACHIEVEMENTS}` ADD COLUMN {col_name} {col_def}")

    # Migrate image_url to LONGTEXT if needed (for base64 image storage)
    try:
        cursor.execute(f"ALTER TABLE `{TABLE_ACHIEVEMENTS}` MODIFY COLUMN image_url LONGTEXT")
        print("✓ Migrated image_url to LONGTEXT")
    except Exception as e:
        if "Duplicate column name" not in str(e):
            print(f"Note: image_url migration: {e}")


    # Create indexes for overall_alumni (if they don't exist)
    index_statements = [
        f"CREATE INDEX idx_email ON `{TABLE_OVERALL_ALUMNI}` (email);",
        f"CREATE INDEX idx_mobile ON `{TABLE_OVERALL_ALUMNI}` (mobile);",
        f"CREATE INDEX idx_batch ON `{TABLE_OVERALL_ALUMNI}` (batch);",
        f"CREATE INDEX idx_name ON `{TABLE_OVERALL_ALUMNI}` (name);"
    ]
    
    for index_stmt in index_statements:
        try:
            cursor.execute(index_stmt)
            index_name = index_stmt.split("idx_")[1].split()[0]
            print(f"✓ Index created: idx_{index_name}")
        except Exception as e:
            # Index already exists - this is OK
            if "Duplicate key name" in str(e):
                index_name = index_stmt.split("idx_")[1].split()[0]
                print(f"✓ Index already exists: idx_{index_name}")
            else:
                print(f"⚠ Index error: {str(e)[:80]}")

    conn.commit()
    cursor.close()
    conn.close()

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(verification_bp, url_prefix="/verification")
app.register_blueprint(posts_bp, url_prefix="/posts")

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5555)
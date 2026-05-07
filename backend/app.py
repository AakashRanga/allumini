from flask import Flask, request
from routes.auth import auth_bp
from db import get_connection
from models import CREATE_ALUMNI_USERS_TABLE, TABLE_ALUMNI_USERS

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
        if not col or col.upper().startswith('PRIMARY KEY'):
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

    # Create table if not exists
    cursor.execute(CREATE_ALUMNI_USERS_TABLE)

    # Auto-migrate: parse expected columns from models.py SQL
    expected_columns = parse_columns_from_sql(CREATE_ALUMNI_USERS_TABLE)
    existing_columns = get_table_columns(cursor, TABLE_ALUMNI_USERS)

    for col_name, col_def in expected_columns.items():
        if col_name not in existing_columns:
            print(f"Adding missing column: {col_name}")
            cursor.execute(f"ALTER TABLE `{TABLE_ALUMNI_USERS}` ADD COLUMN {col_name} {col_def}")

    conn.commit()
    cursor.close()
    conn.close()

app.register_blueprint(auth_bp, url_prefix="/auth")

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5555)
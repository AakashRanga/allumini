from mysql.connector import pooling
from config import DB_CONFIG

db_pool = pooling.MySQLConnectionPool(
    pool_name="alumni_pool",
    pool_size=5,
    pool_reset_session=True,
    **DB_CONFIG
)

def get_connection():
    return db_pool.get_connection()


def execute_query(query, params=None, fetch_one=False):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(query, params or ())

    result = None
    if query.strip().lower().startswith("select"):
        result = cursor.fetchone() if fetch_one else cursor.fetchall()
    else:
        conn.commit()

    cursor.close()
    conn.close()
    return result
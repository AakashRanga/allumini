from db import execute_query
from models import TABLE_ALUMNI_USERS, TABLE_NOTIFICATIONS

def send_notification_to_user(user_id, title, message, notification_type):
    try:
        execute_query(
            f"INSERT INTO {TABLE_NOTIFICATIONS} (user_id, title, message, type) VALUES (%s, %s, %s, %s)",
            (user_id, title, message, notification_type)
        )
    except Exception as e:
        print(f"Error sending notification to user {user_id}: {e}")

def send_notification_to_all_admins(title, message, notification_type):
    try:
        admins = execute_query(f"SELECT id FROM {TABLE_ALUMNI_USERS} WHERE role = 'admin'")
        for admin in admins:
            send_notification_to_user(admin['id'], title, message, notification_type)
    except Exception as e:
        print(f"Error sending notification to all admins: {e}")

def send_notification_to_all_alumni(title, message, notification_type):
    try:
        alumni = execute_query(f"SELECT id FROM {TABLE_ALUMNI_USERS} WHERE role = 'alumni' AND is_approved = 1")
        for alum in alumni:
            send_notification_to_user(alum['id'], title, message, notification_type)
    except Exception as e:
        print(f"Error sending notification to all alumni: {e}")

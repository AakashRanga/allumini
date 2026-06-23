from flask import Blueprint, request, jsonify
from db import execute_query
from models import TABLE_NOTIFICATIONS

notifications_bp = Blueprint('notifications', __name__)

def get_authenticated_user_id():
    user_id = request.headers.get('X-Auth-User-Id')
    return user_id

@notifications_bp.route("", methods=["GET"])
def get_notifications():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        notifications = execute_query(
            f"SELECT id, user_id, title, message, type, is_read, created_at FROM {TABLE_NOTIFICATIONS} WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,)
        )
        return jsonify(notifications), 200
    except Exception as e:
        print(f"Error fetching notifications: {e}")
        return jsonify({"error": str(e)}), 500

@notifications_bp.route("/<int:notification_id>/read", methods=["PUT"])
def mark_read(notification_id):
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        execute_query(
            f"UPDATE {TABLE_NOTIFICATIONS} SET is_read = 1 WHERE id = %s AND user_id = %s",
            (notification_id, user_id)
        )
        return jsonify({"message": "Notification marked as read"}), 200
    except Exception as e:
        print(f"Error marking notification as read: {e}")
        return jsonify({"error": str(e)}), 500

@notifications_bp.route("/read-all", methods=["PUT"])
def mark_all_read():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        execute_query(
            f"UPDATE {TABLE_NOTIFICATIONS} SET is_read = 1 WHERE user_id = %s",
            (user_id,)
        )
        return jsonify({"message": "All notifications marked as read"}), 200
    except Exception as e:
        print(f"Error marking all notifications as read: {e}")
        return jsonify({"error": str(e)}), 500

@notifications_bp.route("/<int:notification_id>", methods=["DELETE"])
def delete_notification(notification_id):
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        execute_query(
            f"DELETE FROM {TABLE_NOTIFICATIONS} WHERE id = %s AND user_id = %s",
            (notification_id, user_id)
        )
        return jsonify({"message": "Notification deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting notification: {e}")
        return jsonify({"error": str(e)}), 500

from flask import Blueprint, request, jsonify
from db import execute_query, get_connection
from models import TABLE_GURUPADIGAM_MESSAGES, TABLE_ALUMNI_USERS
import os
import uuid

gurupadigam_bp = Blueprint('gurupadigam', __name__)

# Configuration for attachments
GURUPADIGAM_ATTACHMENTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'gurupadigam_attachments')
os.makedirs(GURUPADIGAM_ATTACHMENTS_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {
    # Images
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico',
    # Documents
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt',
    # Archives
    'zip', 'rar', '7z', 'tar', 'gz',
    # Audio
    'mp3', 'wav', 'ogg', 'flac', 'aac',
    # Video
    'mp4', 'avi', 'mov', 'mkv', 'webm', 'flv',
    # Others
    'html', 'css', 'js', 'json', 'xml', 'csv'
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_authenticated_user_id():
    user_id = request.headers.get('X-Auth-User-Id')
    return user_id

def get_authenticated_user_role():
    role = request.headers.get('X-Auth-Role')
    return role

@gurupadigam_bp.route("", methods=["GET"])
def get_gurupadigam_messages():
    try:
        messages = execute_query(
            f"SELECT id, admin_id, title, description, attachment_url, is_published, created_at FROM {TABLE_GURUPADIGAM_MESSAGES} WHERE is_published = 1 ORDER BY created_at DESC"
        )

        # Get admin names for each message
        for msg in messages:
            admin = execute_query(
                f"SELECT name FROM {TABLE_ALUMNI_USERS} WHERE id = %s",
                (msg['admin_id'],),
                fetch_one=True
            )
            msg['admin_name'] = admin['name'] if admin else 'Unknown'
            # Parse JSON attachment_url if stored as string
            if msg['attachment_url'] and isinstance(msg['attachment_url'], str):
                import json
                msg['attachment_url'] = json.loads(msg['attachment_url'])

        return jsonify(messages), 200
    except Exception as e:
        print(f"Error fetching gurupadigam messages: {str(e)}")
        return jsonify({"error": str(e)}), 500

@gurupadigam_bp.route("/<int:message_id>", methods=["GET"])
def get_gurupadigam_message(message_id):
    try:
        message = execute_query(
            f"SELECT id, admin_id, title, description, attachment_url, is_published, created_at FROM {TABLE_GURUPADIGAM_MESSAGES} WHERE id = %s",
            (message_id,),
            fetch_one=True
        )

        if not message:
            return jsonify({"error": "Message not found"}), 404

        admin = execute_query(
            f"SELECT name FROM {TABLE_ALUMNI_USERS} WHERE id = %s",
            (message['admin_id'],),
            fetch_one=True
        )
        message['admin_name'] = admin['name'] if admin else 'Unknown'
        if message['attachment_url'] and isinstance(message['attachment_url'], str):
            import json
            message['attachment_url'] = json.loads(message['attachment_url'])

        return jsonify(message), 200
    except Exception as e:
        print(f"Error fetching gurupadigam message: {str(e)}")
        return jsonify({"error": str(e)}), 500

@gurupadigam_bp.route("", methods=["POST"])
def create_gurupadigam_message():
    user_id = get_authenticated_user_id()
    role = get_authenticated_user_role()

    if not user_id or role != "admin":
        return jsonify({"error": "Unauthorized - Admin only"}), 401

    try:
        import json
        title = request.form.get("title")
        description = request.form.get("description")
        is_published = 1 if request.form.get("is_published", "1") == "1" else 0

        if not title:
            return jsonify({"error": "Title is required"}), 400

        attachment_url = []

        # Handle multiple file uploads
        if 'attachment' in request.files:
            files = request.files.getlist('attachment')
            for file in files:
                if file.filename and allowed_file(file.filename):
                    ext = file.filename.rsplit('.', 1)[1].lower()
                    unique_filename = f"{uuid.uuid4().hex}.{ext}"
                    file_path = os.path.join(GURUPADIGAM_ATTACHMENTS_DIR, unique_filename)
                    file.save(file_path)

                    attachment_url.append({
                        "url": unique_filename,
                        "name": file.filename,
                        "type": ext
                    })
                elif file.filename and not allowed_file(file.filename):
                    return jsonify({"error": f"Invalid file type: {file.filename}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"}), 400

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            f"INSERT INTO {TABLE_GURUPADIGAM_MESSAGES} (admin_id, title, description, attachment_url, is_published) VALUES (%s, %s, %s, %s, %s)",
            (user_id, title, description, json.dumps(attachment_url) if attachment_url else None, is_published)
        )
        last_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "message": "Gurupadigam message created successfully",
            "id": last_id
        }), 201
    except Exception as e:
        print(f"Error creating gurupadigam message: {str(e)}")
        return jsonify({"error": str(e)}), 500

@gurupadigam_bp.route("/<int:message_id>", methods=["PUT"])
def update_gurupadigam_message(message_id):
    user_id = get_authenticated_user_id()
    role = get_authenticated_user_role()

    if not user_id or role != "admin":
        return jsonify({"error": "Unauthorized - Admin only"}), 401

    try:
        import json
        # Check if message exists
        existing = execute_query(
            f"SELECT admin_id, attachment_url FROM {TABLE_GURUPADIGAM_MESSAGES} WHERE id = %s",
            (message_id,),
            fetch_one=True
        )

        if not existing:
            return jsonify({"error": "Message not found"}), 404

        if str(existing['admin_id']) != str(user_id):
            return jsonify({"error": "Unauthorized - You can only update your own messages"}), 403

        title = request.form.get("title", "")
        description = request.form.get("description", "")
        is_published = 1 if request.form.get("is_published", "1") == "1" else 0

        attachment_url = []
        if existing['attachment_url']:
            if isinstance(existing['attachment_url'], str):
                attachment_url = json.loads(existing['attachment_url'])
            else:
                attachment_url = existing['attachment_url']

        # Handle file upload (replace or add)
        if 'attachment' in request.files:
            files = request.files.getlist('attachment')
            # Delete old attachment_url
            for att in attachment_url:
                old_path = os.path.join(GURUPADIGAM_ATTACHMENTS_DIR, att['url'])
                if os.path.exists(old_path):
                    os.remove(old_path)
            
            attachment_url = []
            for file in files:
                if file.filename and allowed_file(file.filename):
                    ext = file.filename.rsplit('.', 1)[1].lower()
                    unique_filename = f"{uuid.uuid4().hex}.{ext}"
                    file_path = os.path.join(GURUPADIGAM_ATTACHMENTS_DIR, unique_filename)
                    file.save(file_path)

                    attachment_url.append({
                        "url": unique_filename,
                        "name": file.filename,
                        "type": ext
                    })
                elif file.filename and not allowed_file(file.filename):
                    return jsonify({"error": f"Invalid file type: {file.filename}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"}), 400

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            f"UPDATE {TABLE_GURUPADIGAM_MESSAGES} SET title=%s, description=%s, attachment_url=%s, is_published=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s",
            (title, description, json.dumps(attachment_url) if attachment_url else None, is_published, message_id)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Gurupadigam message updated successfully"}), 200
    except Exception as e:
        print(f"Error updating gurupadigam message: {str(e)}")
        return jsonify({"error": str(e)}), 500

@gurupadigam_bp.route("/<int:message_id>", methods=["DELETE"])
def delete_gurupadigam_message(message_id):
    user_id = get_authenticated_user_id()
    role = get_authenticated_user_role()

    if not user_id or role != "admin":
        return jsonify({"error": "Unauthorized - Admin only"}), 401

    try:
        existing = execute_query(
            f"SELECT admin_id, attachment_url FROM {TABLE_GURUPADIGAM_MESSAGES} WHERE id = %s",
            (message_id,),
            fetch_one=True
        )

        if not existing:
            return jsonify({"error": "Message not found"}), 404

        if str(existing['admin_id']) != str(user_id):
            return jsonify({"error": "Unauthorized - You can only delete your own messages"}), 403

        # Delete all attachment files
        if existing['attachment_url']:
            import json
            attachment_url = existing['attachment_url']
            if isinstance(attachment_url, str):
                attachment_url = json.loads(attachment_url)
            
            for att in attachment_url:
                file_path = os.path.join(GURUPADIGAM_ATTACHMENTS_DIR, att['url'])
                if os.path.exists(file_path):
                    os.remove(file_path)

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            f"DELETE FROM {TABLE_GURUPADIGAM_MESSAGES} WHERE id = %s",
            (message_id,)
        )
        conn.commit()
        cursor.close()
        conn.close()


        return jsonify({"message": "Gurupadigam message deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting gurupadigam message: {str(e)}")
        return jsonify({"error": str(e)}), 500
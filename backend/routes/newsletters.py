from flask import Blueprint, request, jsonify
from db import execute_query, get_connection
from models import TABLE_NEWSLETTERS, TABLE_ALUMNI_USERS
import os
import uuid
import json

newsletter_bp = Blueprint('newsletter', __name__)

NEWSLETTER_ATTACHMENTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'newsletter_attachments')
os.makedirs(NEWSLETTER_ATTACHMENTS_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {
    'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'rtf', 'odt',
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico',
}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_authenticated_user_id():
    return request.headers.get('X-Auth-User-Id')


def get_authenticated_user_role():
    return request.headers.get('X-Auth-Role')


@newsletter_bp.route('', methods=['GET'])
def get_newsletters():
    try:
        newsletters = execute_query(
            f"SELECT id, admin_id, title, description, attachment_url, thumbnail, is_published, created_at FROM {TABLE_NEWSLETTERS} WHERE is_published = 1 ORDER BY created_at DESC"
        )

        for newsletter in newsletters:
            admin = execute_query(
                f"SELECT name FROM {TABLE_ALUMNI_USERS} WHERE id = %s",
                (newsletter['admin_id'],),
                fetch_one=True
            )
            newsletter['admin_name'] = admin['name'] if admin else 'Unknown'
            if newsletter['attachment_url'] and isinstance(newsletter['attachment_url'], str):
                newsletter['attachment_url'] = json.loads(newsletter['attachment_url'])

        return jsonify(newsletters), 200
    except Exception as e:
        print(f"Error fetching newsletters: {e}")
        return jsonify({"error": str(e)}), 500


@newsletter_bp.route('/<int:newsletter_id>', methods=['GET'])
def get_newsletter(newsletter_id):
    try:
        newsletter = execute_query(
            f"SELECT id, admin_id, title, description, attachment_url, thumbnail, is_published, created_at FROM {TABLE_NEWSLETTERS} WHERE id = %s",
            (newsletter_id,),
            fetch_one=True
        )

        if not newsletter:
            return jsonify({"error": "Newsletter not found"}), 404

        admin = execute_query(
            f"SELECT name FROM {TABLE_ALUMNI_USERS} WHERE id = %s",
            (newsletter['admin_id'],),
            fetch_one=True
        )
        newsletter['admin_name'] = admin['name'] if admin else 'Unknown'
        if newsletter['attachment_url'] and isinstance(newsletter['attachment_url'], str):
            newsletter['attachment_url'] = json.loads(newsletter['attachment_url'])

        return jsonify(newsletter), 200
    except Exception as e:
        print(f"Error fetching newsletter: {e}")
        return jsonify({"error": str(e)}), 500


@newsletter_bp.route('', methods=['POST'])
def create_newsletter():
    user_id = get_authenticated_user_id()
    role = get_authenticated_user_role()

    if not user_id or role != 'admin':
        return jsonify({"error": "Unauthorized - Admin only"}), 401

    try:
        title = request.form.get('title')
        description = request.form.get('description')
        is_published = 1 if request.form.get('is_published', '1') == '1' else 0

        if not title:
            return jsonify({"error": "Title is required"}), 400

        attachment_url = []
        if 'attachment' in request.files:
            files = request.files.getlist('attachment')
            for file in files:
                if file.filename and allowed_file(file.filename):
                    ext = file.filename.rsplit('.', 1)[1].lower()
                    unique_filename = f"{uuid.uuid4().hex}.{ext}"
                    file_path = os.path.join(NEWSLETTER_ATTACHMENTS_DIR, unique_filename)
                    file.save(file_path)
                    attachment_url.append({
                        "url": unique_filename,
                        "name": file.filename,
                        "type": ext,
                    })
                elif file.filename and not allowed_file(file.filename):
                    return jsonify({"error": f"Invalid file type: {file.filename}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"}), 400

        thumbnail_filename = None
        if 'thumbnail' in request.files:
            thumb_file = request.files['thumbnail']
            if thumb_file.filename and allowed_file(thumb_file.filename):
                ext = thumb_file.filename.rsplit('.', 1)[1].lower()
                thumbnail_filename = f"{uuid.uuid4().hex}.{ext}"
                thumb_path = os.path.join(NEWSLETTER_ATTACHMENTS_DIR, thumbnail_filename)
                thumb_file.save(thumb_path)

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            f"INSERT INTO {TABLE_NEWSLETTERS} (admin_id, title, description, attachment_url, thumbnail, is_published) VALUES (%s, %s, %s, %s, %s, %s)",
            (user_id, title, description, json.dumps(attachment_url) if attachment_url else None, thumbnail_filename, is_published)
        )
        last_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Newsletter created successfully", "id": last_id}), 201
    except Exception as e:
        print(f"Error creating newsletter: {e}")
        return jsonify({"error": str(e)}), 500


@newsletter_bp.route('/<int:newsletter_id>', methods=['PUT'])
def update_newsletter(newsletter_id):
    user_id = get_authenticated_user_id()
    role = get_authenticated_user_role()

    if not user_id or role != 'admin':
        return jsonify({"error": "Unauthorized - Admin only"}), 401

    try:
        existing = execute_query(
            f"SELECT admin_id, attachment_url, thumbnail FROM {TABLE_NEWSLETTERS} WHERE id = %s",
            (newsletter_id,),
            fetch_one=True
        )

        if not existing:
            return jsonify({"error": "Newsletter not found"}), 404

        if str(existing['admin_id']) != str(user_id):
            return jsonify({"error": "Unauthorized - You can only update your own newsletters"}), 403

        title = request.form.get('title', '')
        description = request.form.get('description', '')
        is_published = 1 if request.form.get('is_published', '1') == '1' else 0

        attachment_url = []
        if existing['attachment_url']:
            if isinstance(existing['attachment_url'], str):
                attachment_url = json.loads(existing['attachment_url'])
            else:
                attachment_url = existing['attachment_url']

        if 'attachment' in request.files:
            files = request.files.getlist('attachment')
            for att in attachment_url:
                old_path = os.path.join(NEWSLETTER_ATTACHMENTS_DIR, att['url'])
                if os.path.exists(old_path):
                    os.remove(old_path)
            attachment_url = []
            for file in files:
                if file.filename and allowed_file(file.filename):
                    ext = file.filename.rsplit('.', 1)[1].lower()
                    unique_filename = f"{uuid.uuid4().hex}.{ext}"
                    file_path = os.path.join(NEWSLETTER_ATTACHMENTS_DIR, unique_filename)
                    file.save(file_path)
                    attachment_url.append({
                        "url": unique_filename,
                        "name": file.filename,
                        "type": ext,
                    })
                elif file.filename and not allowed_file(file.filename):
                    return jsonify({"error": f"Invalid file type: {file.filename}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"}), 400

        thumbnail_filename = existing.get('thumbnail')
        if 'thumbnail' in request.files:
            thumb_file = request.files['thumbnail']
            if thumb_file.filename and allowed_file(thumb_file.filename):
                if existing.get('thumbnail'):
                    old_thumb_path = os.path.join(NEWSLETTER_ATTACHMENTS_DIR, existing['thumbnail'])
                    if os.path.exists(old_thumb_path):
                        os.remove(old_thumb_path)
                ext = thumb_file.filename.rsplit('.', 1)[1].lower()
                thumbnail_filename = f"{uuid.uuid4().hex}.{ext}"
                thumb_path = os.path.join(NEWSLETTER_ATTACHMENTS_DIR, thumbnail_filename)
                thumb_file.save(thumb_path)

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            f"UPDATE {TABLE_NEWSLETTERS} SET title=%s, description=%s, attachment_url=%s, thumbnail=%s, is_published=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s",
            (title, description, json.dumps(attachment_url) if attachment_url else None, thumbnail_filename, is_published, newsletter_id)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Newsletter updated successfully"}), 200
    except Exception as e:
        print(f"Error updating newsletter: {e}")
        return jsonify({"error": str(e)}), 500


@newsletter_bp.route('/<int:newsletter_id>', methods=['DELETE'])
def delete_newsletter(newsletter_id):
    user_id = get_authenticated_user_id()
    role = get_authenticated_user_role()

    if not user_id or role != 'admin':
        return jsonify({"error": "Unauthorized - Admin only"}), 401

    try:
        existing = execute_query(
            f"SELECT admin_id, attachment_url FROM {TABLE_NEWSLETTERS} WHERE id = %s",
            (newsletter_id,),
            fetch_one=True
        )

        if not existing:
            return jsonify({"error": "Newsletter not found"}), 404

        if str(existing['admin_id']) != str(user_id):
            return jsonify({"error": "Unauthorized - You can only delete your own newsletters"}), 403

        if existing['attachment_url']:
            attachment_url = existing['attachment_url']
            if isinstance(attachment_url, str):
                attachment_url = json.loads(attachment_url)
            for att in attachment_url:
                file_path = os.path.join(NEWSLETTER_ATTACHMENTS_DIR, att['url'])
                if os.path.exists(file_path):
                    os.remove(file_path)

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            f"DELETE FROM {TABLE_NEWSLETTERS} WHERE id = %s",
            (newsletter_id,)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Newsletter deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting newsletter: {e}")
        return jsonify({"error": str(e)}), 500

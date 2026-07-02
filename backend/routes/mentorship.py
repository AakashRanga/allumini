from flask import Blueprint, request, jsonify
import os
import uuid
from datetime import datetime
from db import execute_query, get_connection
from models import TABLE_ALUMNI_USERS, TABLE_MENTORSHIP_SESSIONS, TABLE_MENTORSHIP_REQUESTS
from utils.notifications import send_notification_to_user, send_notification_to_all_admins, send_notification_to_all_alumni

mentorship_bp = Blueprint("mentorship", __name__)

def get_authenticated_user_id():
    user_id = request.headers.get("X-Auth-User-Id")
    if not user_id:
        return None
    try:
        return int(user_id)
    except ValueError:
        return None

def check_admin_auth():
    role = request.headers.get("X-Auth-Role")
    user_id = request.headers.get("X-Auth-User-Id")
    if role != "admin" or not user_id:
        return False
    return True

@mentorship_bp.route("/sessions", methods=["POST"])
def create_session():
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

    topic = request.form.get("topic", "").strip()
    description = request.form.get("description", "").strip()
    date_str = request.form.get("date", "").strip()
    venue = request.form.get("venue", "").strip()
    details = request.form.get("details", "").strip()
    
    # Real-time mentorship fields
    mentorship_type = request.form.get("mentorship_type", "online").strip()
    duration = request.form.get("duration", "60").strip()
    target_audience = request.form.get("target_audience", "").strip()
    max_attendees = request.form.get("max_attendees", "").strip()
    meeting_link = request.form.get("meeting_link", "").strip()

    if not topic or not date_str or not venue:
        return jsonify({"error": "Topic, Date, and Venue are required."}), 400

    try:
        # Validate date
        try:
            if "T" in date_str:
                dt = datetime.strptime(date_str.split(".")[0], "%Y-%m-%dT%H:%M")
            else:
                dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
        except Exception:
            try:
                dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M")
            except Exception:
                return jsonify({"error": f"Invalid date format: {date_str}. Expected YYYY-MM-DD HH:MM"}), 400

        # Handle banner image
        banner_filename = None
        if "banner" in request.files:
            banner_file = request.files["banner"]
            if banner_file and banner_file.filename:
                allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
                ext = banner_file.filename.rsplit('.', 1)[1].lower() if '.' in banner_file.filename else ''
                if ext not in allowed_extensions:
                    return jsonify({"error": "Invalid file type. Banner must be an image (PNG, JPG, JPEG, GIF, WEBP)."}), 400
                
                banner_filename = f"{uuid.uuid4().hex}.{ext}"
                from app import MENTORSHIP_BANNERS_DIR
                banner_path = os.path.join(MENTORSHIP_BANNERS_DIR, banner_filename)
                banner_file.save(banner_path)

        # Parse integers
        duration_val = 60
        if duration:
            try:
                duration_val = int(duration)
            except ValueError:
                pass

        max_attendees_val = None
        if max_attendees:
            try:
                max_attendees_val = int(max_attendees)
            except ValueError:
                pass

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            f"""
            INSERT INTO {TABLE_MENTORSHIP_SESSIONS} 
            (topic, description, date, venue, banner_image, details, mentorship_type, duration, target_audience, max_attendees, meeting_link, status) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'open')
            """,
            (topic, description, dt, venue, banner_filename, details, mentorship_type, duration_val, target_audience, max_attendees_val, meeting_link)
        )
        conn.commit()
        cursor.close()
        conn.close()

        # Send Notification to all alumni
        try:
            date_str = dt.strftime("%B %d, %Y at %I:%M %p")
            send_notification_to_all_alumni(
                title="New Mentorship Opportunity Available",
                message=f"A new session on '{topic}' has been scheduled for {date_str}. Apply as a mentor inside the Community tab!",
                notification_type="mentorship"
            )
        except Exception as notify_err:
            print(f"Failed to send mentorship notification: {notify_err}")

        return jsonify({"success": True, "message": "Mentorship session created successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mentorship_bp.route("/sessions", methods=["GET"])
def get_sessions():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = f"""
        SELECT 
            s.*,
            u.name as mentor_name,
            u.email as mentor_email,
            u.profile_image as mentor_image
        FROM {TABLE_MENTORSHIP_SESSIONS} s
        LEFT JOIN {TABLE_ALUMNI_USERS} u ON s.mentor_id = u.id
        ORDER BY s.date ASC
        """
        sessions = execute_query(query)

        role = request.headers.get("X-Auth-Role")
        user_requests = {}
        if role == "alumni":
            reqs = execute_query(
                f"SELECT session_id, status FROM {TABLE_MENTORSHIP_REQUESTS} WHERE alumni_id = %s",
                (user_id,)
            )
            user_requests = {r["session_id"]: r["status"] for r in reqs}

        for s in sessions:
            if s.get("date"):
                if isinstance(s["date"], datetime):
                    s["date"] = s["date"].isoformat()
                else:
                    s["date"] = str(s["date"])
            
            s["user_request_status"] = user_requests.get(s["id"], None)

        return jsonify(sessions), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mentorship_bp.route("/sessions/<int:session_id>", methods=["GET"])
def get_session(session_id):
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        session = execute_query(
            f"""
            SELECT 
                s.*,
                u.name as mentor_name,
                u.email as mentor_email,
                u.profile_image as mentor_image
            FROM {TABLE_MENTORSHIP_SESSIONS} s
            LEFT JOIN {TABLE_ALUMNI_USERS} u ON s.mentor_id = u.id
            WHERE s.id = %s
            """,
            (session_id,),
            fetch_one=True
        )

        if not session:
            return jsonify({"error": "Mentorship session not found"}), 404

        if session.get("date"):
            if isinstance(session["date"], datetime):
                session["date"] = session["date"].isoformat()
            else:
                session["date"] = str(session["date"])

        return jsonify(session), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mentorship_bp.route("/sessions/<int:session_id>/request", methods=["POST"])
def request_session(session_id):
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    role = request.headers.get("X-Auth-Role")
    if role != "alumni":
        return jsonify({"error": "Only alumni can request to mentor sessions."}), 403

    try:
        session = execute_query(
            f"SELECT topic, status FROM {TABLE_MENTORSHIP_SESSIONS} WHERE id = %s",
            (session_id,),
            fetch_one=True
        )
        if not session:
            return jsonify({"error": "Mentorship session not found"}), 404
        
        if session["status"] != "open":
            return jsonify({"error": "This mentorship session is no longer open for requests."}), 400

        existing = execute_query(
            f"SELECT id FROM {TABLE_MENTORSHIP_REQUESTS} WHERE session_id = %s AND alumni_id = %s",
            (session_id, user_id),
            fetch_one=True
        )
        if existing:
            return jsonify({"error": "You have already requested to mentor this session."}), 400

        execute_query(
            f"INSERT INTO {TABLE_MENTORSHIP_REQUESTS} (session_id, alumni_id, status) VALUES (%s, %s, 'pending')",
            (session_id, user_id)
        )

        alumni_info = execute_query(
            f"SELECT name FROM {TABLE_ALUMNI_USERS} WHERE id = %s",
            (user_id,),
            fetch_one=True
        )
        alumni_name = alumni_info["name"] if alumni_info else "An alumnus"
        send_notification_to_all_admins(
            title="New Mentorship Invitation Request",
            message=f"{alumni_name} requested to mentor session on '{session['topic']}'",
            notification_type="mentorship"
        )

        return jsonify({"success": True, "message": "Mentorship request sent successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mentorship_bp.route("/sessions/<int:session_id>/requests", methods=["GET"])
def get_session_requests(session_id):
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = f"""
        SELECT 
            r.id as request_id,
            r.status as request_status,
            r.created_at,
            u.id as alumni_id,
            u.name as alumni_name,
            u.email as alumni_email,
            u.profile_image as alumni_image,
            u.specialization as alumni_specialization
        FROM {TABLE_MENTORSHIP_REQUESTS} r
        JOIN {TABLE_ALUMNI_USERS} u ON r.alumni_id = u.id
        WHERE r.session_id = %s
        ORDER BY r.created_at DESC
        """
        requests_list = execute_query(query, (session_id,))
        return jsonify(requests_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mentorship_bp.route("/requests/<int:req_id>/approve", methods=["POST"])
def approve_request(req_id):
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        req_details = execute_query(
            f"""
            SELECT 
                r.session_id, 
                r.alumni_id, 
                s.topic,
                s.date
            FROM {TABLE_MENTORSHIP_REQUESTS} r
            JOIN {TABLE_MENTORSHIP_SESSIONS} s ON r.session_id = s.id
            WHERE r.id = %s
            """,
            (req_id,),
            fetch_one=True
        )
        if not req_details:
            return jsonify({"error": "Mentorship request not found"}), 404

        session_id = req_details["session_id"]
        alumni_id = req_details["alumni_id"]
        topic = req_details["topic"]
        dt = req_details["date"]
        
        date_str = dt.strftime("%B %d, %Y at %I:%M %p") if isinstance(dt, datetime) else str(dt)

        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            f"UPDATE {TABLE_MENTORSHIP_REQUESTS} SET status = 'approved' WHERE id = %s",
            (req_id,)
        )
        
        cursor.execute(
            f"UPDATE {TABLE_MENTORSHIP_REQUESTS} SET status = 'rejected' WHERE session_id = %s AND id != %s",
            (session_id, req_id)
        )
        
        cursor.execute(
            f"UPDATE {TABLE_MENTORSHIP_SESSIONS} SET mentor_id = %s, status = 'assigned' WHERE id = %s",
            (alumni_id, session_id)
        )
        
        conn.commit()
        cursor.close()
        conn.close()

        send_notification_to_user(
            user_id=alumni_id,
            title="Mentorship Request Approved!",
            message=f"You have been assigned as the mentor for the session: '{topic}' on {date_str}.",
            notification_type="mentorship"
        )

        return jsonify({"success": True, "message": "Mentorship request approved and assigned successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mentorship_bp.route("/requests/<int:req_id>/reject", methods=["POST"])
def reject_request(req_id):
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        req_details = execute_query(
            f"SELECT session_id, alumni_id FROM {TABLE_MENTORSHIP_REQUESTS} WHERE id = %s",
            (req_id,),
            fetch_one=True
        )
        if not req_details:
            return jsonify({"error": "Mentorship request not found"}), 404

        execute_query(
            f"UPDATE {TABLE_MENTORSHIP_REQUESTS} SET status = 'rejected' WHERE id = %s",
            (req_id,)
        )

        return jsonify({"success": True, "message": "Mentorship request rejected successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mentorship_bp.route("/sessions/<int:session_id>", methods=["DELETE"])
def delete_session(session_id):
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        session = execute_query(
            f"SELECT banner_image FROM {TABLE_MENTORSHIP_SESSIONS} WHERE id = %s",
            (session_id,),
            fetch_one=True
        )
        if not session:
            return jsonify({"error": "Mentorship session not found"}), 404

        banner_filename = session["banner_image"]
        if banner_filename:
            try:
                from app import MENTORSHIP_BANNERS_DIR
                banner_path = os.path.join(MENTORSHIP_BANNERS_DIR, banner_filename)
                if os.path.exists(banner_path):
                    os.remove(banner_path)
            except Exception as e:
                print(f"Error deleting mentorship banner: {e}")

        execute_query(
            f"DELETE FROM {TABLE_MENTORSHIP_SESSIONS} WHERE id = %s",
            (session_id,)
        )

        return jsonify({"success": True, "message": "Mentorship session deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

from flask import Blueprint, request, jsonify
from db import execute_query
from models import TABLE_JOBS, TABLE_ACHIEVEMENTS, TABLE_ALUMNI_USERS
import json

posts_bp = Blueprint("posts", __name__)

@posts_bp.route("/job", methods=["POST"])
def create_job():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400

    user_id = data.get("user_id")
    company = data.get("company", "").strip()
    role = data.get("role", "").strip()
    location = data.get("location", "").strip()
    job_type = data.get("jobType", "Full-time")
    salary = data.get("salary", "").strip()
    description = data.get("description", "").strip()
    requirements = data.get("requirements", "").strip()
    apply_link = data.get("applyLink", "").strip()

    if not all([user_id, company, role, location, description, apply_link]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        execute_query(
            f"""INSERT INTO `{TABLE_JOBS}` 
            (user_id, company, role, location, job_type, salary, description, requirements, apply_link)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (user_id, company, role, location, job_type, salary, description, requirements, apply_link)
        )
        return jsonify({"success": True, "message": "Job posted successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route("/achievement", methods=["POST"])
def create_achievement():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400

    user_id = data.get("user_id")
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    image_url = data.get("imageUrl", "")

    if not all([user_id, title, description]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        execute_query(
            f"""INSERT INTO `{TABLE_ACHIEVEMENTS}` 
            (user_id, title, description, image_url)
            VALUES (%s, %s, %s, %s)""",
            (user_id, title, description, image_url)
        )
        return jsonify({"success": True, "message": "Achievement posted successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route("/jobs", methods=["GET"])
def get_jobs():
    try:
        query = f"""
        SELECT j.*, a.name as poster_name
        FROM `{TABLE_JOBS}` j
        JOIN `{TABLE_ALUMNI_USERS}` a ON j.user_id = a.id
        WHERE j.is_blocked = 0
        ORDER BY j.created_at DESC
        """
        jobs = execute_query(query)
        return jsonify(jobs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route("/achievements", methods=["GET"])
def get_achievements():
    try:
        query = f"""
        SELECT ac.*, a.name as poster_name
        FROM `{TABLE_ACHIEVEMENTS}` ac
        JOIN `{TABLE_ALUMNI_USERS}` a ON ac.user_id = a.id
        WHERE ac.is_blocked = 0
        ORDER BY ac.created_at DESC
        """
        achievements = execute_query(query)
        return jsonify(achievements), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_authenticated_user_id():
    user_id = request.headers.get("X-Auth-User-Id")
    if not user_id:
        return None
    try:
        return int(user_id)
    except ValueError:
        return None

@posts_bp.route("/my-jobs", methods=["GET"])
def get_my_jobs():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = f"""
        SELECT j.*, a.name as poster_name
        FROM `{TABLE_JOBS}` j
        JOIN `{TABLE_ALUMNI_USERS}` a ON j.user_id = a.id
        WHERE j.user_id = %s AND j.is_blocked = 0
        ORDER BY j.created_at DESC
        """
        jobs = execute_query(query, (user_id,))
        return jsonify(jobs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route("/my-achievements", methods=["GET"])
def get_my_achievements():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = f"""
        SELECT ac.*, a.name as poster_name
        FROM `{TABLE_ACHIEVEMENTS}` ac
        JOIN `{TABLE_ALUMNI_USERS}` a ON ac.user_id = a.id
        WHERE ac.user_id = %s AND ac.is_blocked = 0
        ORDER BY ac.created_at DESC
        """
        achievements = execute_query(query, (user_id,))
        return jsonify(achievements), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route("/job/<int:job_id>", methods=["PUT"])
def update_job(job_id):
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    existing = execute_query(
        f"SELECT user_id FROM `{TABLE_JOBS}` WHERE id=%s",
        (job_id,),
        fetch_one=True
    )
    if not existing:
        return jsonify({"error": "Job not found"}), 404
    if existing.get("user_id") != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    allowed_fields = ["company", "role", "location", "job_type", "salary", "description", "requirements", "apply_link"]
    updates = []
    params = []
    for field in allowed_fields:
        if field in data:
            updates.append(f"{field} = %s")
            params.append(data[field])

    if not updates:
        return jsonify({"error": "No fields to update"}), 400

    params.append(job_id)
    query = f"UPDATE `{TABLE_JOBS}` SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
    try:
        execute_query(query, tuple(params))
        return jsonify({"success": True, "message": "Job updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route("/achievement/<int:achievement_id>", methods=["PUT"])
def update_achievement(achievement_id):
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    existing = execute_query(
        f"SELECT user_id FROM `{TABLE_ACHIEVEMENTS}` WHERE id=%s",
        (achievement_id,),
        fetch_one=True
    )
    if not existing:
        return jsonify({"error": "Achievement not found"}), 404
    if existing.get("user_id") != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    allowed_fields = ["title", "description", "image_url"]
    updates = []
    params = []
    for field in allowed_fields:
        if field in data:
            updates.append(f"{field} = %s")
            params.append(data[field])

    if not updates:
        return jsonify({"error": "No fields to update"}), 400

    params.append(achievement_id)
    query = f"UPDATE `{TABLE_ACHIEVEMENTS}` SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
    try:
        execute_query(query, tuple(params))
        return jsonify({"success": True, "message": "Achievement updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ADMIN ROUTES
@posts_bp.route("/admin/jobs", methods=["GET"])
def admin_get_jobs():
    try:
        query = f"""
        SELECT j.*, a.name as poster_name 
        FROM `{TABLE_JOBS}` j
        JOIN `{TABLE_ALUMNI_USERS}` a ON j.user_id = a.id
        ORDER BY j.created_at DESC
        """
        jobs = execute_query(query)
        return jsonify({"success": True, "data": jobs}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route("/admin/achievements", methods=["GET"])
def admin_get_achievements():
    try:
        query = f"""
        SELECT ac.*, a.name as poster_name 
        FROM `{TABLE_ACHIEVEMENTS}` ac
        JOIN `{TABLE_ALUMNI_USERS}` a ON ac.user_id = a.id
        ORDER BY ac.created_at DESC
        """
        achievements = execute_query(query)
        return jsonify({"success": True, "data": achievements}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route("/admin/<post_type>/<int:post_id>/block", methods=["PUT"])
def admin_toggle_block(post_type, post_id):
    if post_type not in ["job", "achievement"]:
        return jsonify({"error": "Invalid post type"}), 400
        
    table = TABLE_JOBS if post_type == "job" else TABLE_ACHIEVEMENTS
    data = request.get_json(silent=True)
    is_blocked = 1 if data.get("is_blocked") else 0
    
    try:
        execute_query(
            f"UPDATE `{table}` SET is_blocked = %s WHERE id = %s",
            (is_blocked, post_id)
        )
        return jsonify({"success": True, "message": f"{post_type} block status updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route("/admin/<post_type>/<int:post_id>", methods=["DELETE"])
def admin_delete_post(post_type, post_id):
    if post_type not in ["job", "achievement"]:
        return jsonify({"error": "Invalid post type"}), 400
        
    table = TABLE_JOBS if post_type == "job" else TABLE_ACHIEVEMENTS
    
    try:
        execute_query(
            f"DELETE FROM `{table}` WHERE id = %s",
            (post_id,)
        )
        return jsonify({"success": True, "message": f"{post_type} deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

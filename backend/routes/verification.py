from flask import Blueprint, request, jsonify
from db import execute_query, get_connection
from models import TABLE_ALUMNI_USERS, TABLE_OVERALL_ALUMNI

verification_bp = Blueprint("verification", __name__)


@verification_bp.route("/requests", methods=["GET"])
def get_verification_requests():
    """Get all pending verification requests"""
    try:
        query = f"""
        SELECT 
            id, 
            name, 
            email, 
            contact_number as phone,
            specialization, 
            academic_details,
            created_at as submittedDate,
            is_approved
        FROM `{TABLE_ALUMNI_USERS}`
        WHERE is_approved = 0 AND email_verified = 1
        ORDER BY created_at DESC
        """
        
        requests_data = execute_query(query)
        
        # Parse academic_details JSON if present
        import json
        for req in requests_data:
            if req.get("academic_details"):
                try:
                    details = json.loads(req["academic_details"])
                    req["degree"] = details.get("degree", "UG")
                    req["batch"] = details.get("batch", "")
                except:
                    req["degree"] = "UG"
                    req["batch"] = ""
            else:
                req["degree"] = "UG"
                req["batch"] = ""
            
            # Format phone number
            if req.get("phone"):
                req["phone"] = str(req["phone"])
        
        return jsonify({
            "success": True,
            "data": requests_data,
            "count": len(requests_data)
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@verification_bp.route("/all-alumni", methods=["GET"])
def get_all_alumni():
    """Get all registered alumni users (excluding admins)"""
    try:
        query = f"""
        SELECT 
            id, 
            name, 
            email, 
            contact_number as phone,
            specialization, 
            academic_details,
            created_at as submittedDate,
            is_approved,
            email_verified
        FROM `{TABLE_ALUMNI_USERS}`
        WHERE role != 'admin'
        ORDER BY created_at DESC
        """
        
        users_data = execute_query(query)
        
        import json
        for user in users_data:
            if user.get("academic_details"):
                try:
                    details = json.loads(user["academic_details"])
                    # If academic_details is a list of degrees, get the first one or primary
                    if isinstance(details, list) and len(details) > 0:
                        primary_detail = details[0]
                        user["degree"] = primary_detail.get("degree", "UG")
                        user["batch"] = primary_detail.get("batch", "")
                    elif isinstance(details, dict):
                        user["degree"] = details.get("degree", "UG")
                        user["batch"] = details.get("batch", "")
                    else:
                        user["degree"] = "UG"
                        user["batch"] = ""
                except:
                    user["degree"] = "UG"
                    user["batch"] = ""
            else:
                user["degree"] = "UG"
                user["batch"] = ""
            
            if user.get("phone"):
                user["phone"] = str(user["phone"])
                
            # Determine status based on verified and approved
            if user.get("is_approved"):
                user["status"] = "Verified"
            else:
                user["status"] = "Pending"
                
            user["avatar"] = "".join([n[0] for n in user.get("name", "").split() if n])[:2].upper()
        
        return jsonify({
            "success": True,
            "data": users_data,
            "count": len(users_data)
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@verification_bp.route("/search", methods=["POST"])
def search_overall_alumni():
    """Search in overall_alumni table with filters"""
    try:
        data = request.get_json()
        search_query = data.get("query", "").strip()
        batch_filter = data.get("batch", "all")
        degree_filter = data.get("degree", "all")
        
        query = f"SELECT * FROM `{TABLE_OVERALL_ALUMNI}` WHERE 1=1"
        params = []
        
        if search_query:
            query += " AND (name LIKE %s OR email LIKE %s OR roll_number LIKE %s)"
            search_term = f"%{search_query}%"
            params.extend([search_term, search_term, search_term])
        
        if batch_filter != "all":
            query += " AND batch = %s"
            params.append(batch_filter)
        
        if degree_filter != "all":
            query += " AND degree = %s"
            params.append(degree_filter)
        
        query += " ORDER BY batch DESC, name ASC"
        
        results = execute_query(query, params)
        
        return jsonify({
            "success": True,
            "data": results,
            "count": len(results)
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@verification_bp.route("/check-match", methods=["POST"])
def check_auto_verification():
    """Check if a user matches any record in overall_alumni (by email or mobile)"""
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        
        # Get user details
        user_query = f"SELECT email, contact_number, name FROM `{TABLE_ALUMNI_USERS}` WHERE id = %s"
        user = execute_query(user_query, (user_id,), fetch_one=True)
        
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        email = user.get("email")
        mobile = user.get("contact_number")
        
        # Search for matches in overall_alumni
        matches = []
        if email:
            email_matches = execute_query(
                f"SELECT * FROM `{TABLE_OVERALL_ALUMNI}` WHERE email = %s",
                (email,)
            )
            matches.extend(email_matches)
        
        if mobile:
            mobile_matches = execute_query(
                f"SELECT * FROM `{TABLE_OVERALL_ALUMNI}` WHERE mobile = %s",
                (mobile,)
            )
            # Avoid duplicates
            existing_ids = {m.get("id") for m in matches}
            for match in mobile_matches:
                if match.get("id") not in existing_ids:
                    matches.append(match)
        
        return jsonify({
            "success": True,
            "has_match": len(matches) > 0,
            "matches": matches,
            "match_count": len(matches)
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@verification_bp.route("/approve", methods=["POST"])
def approve_user():
    """Approve a verification request"""
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        
        if not user_id:
            return jsonify({
                "success": False,
                "error": "user_id is required"
            }), 400
        
        query = f"UPDATE `{TABLE_ALUMNI_USERS}` SET is_approved = 1, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
        execute_query(query, (user_id,))
        
        return jsonify({
            "success": True,
            "message": "User approved successfully"
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@verification_bp.route("/reject", methods=["POST"])
def reject_user():
    """Reject a verification request"""
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        reason = data.get("reason", "")
        
        if not user_id:
            return jsonify({
                "success": False,
                "error": "user_id is required"
            }), 400
        
        query = f"UPDATE `{TABLE_ALUMNI_USERS}` SET is_approved = 0, rejection_reason = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
        execute_query(query, (reason, user_id))
        
        return jsonify({
            "success": True,
            "message": "User rejected successfully"
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@verification_bp.route("/get-batches", methods=["GET"])
def get_all_batches():
    """Get all unique batches from overall_alumni"""
    try:
        query = f"SELECT DISTINCT batch FROM `{TABLE_OVERALL_ALUMNI}` WHERE batch IS NOT NULL ORDER BY batch DESC"
        results = execute_query(query)
        batches = [r["batch"] for r in results]
        
        return jsonify({
            "success": True,
            "data": batches
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@verification_bp.route("/get-degrees", methods=["GET"])
def get_all_degrees():
    """Get all unique degrees from overall_alumni"""
    try:
        query = f"SELECT DISTINCT degree FROM `{TABLE_OVERALL_ALUMNI}` WHERE degree IS NOT NULL"
        results = execute_query(query)
        degrees = [r["degree"] for r in results]
        
        return jsonify({
            "success": True,
            "data": degrees
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from db import execute_query
from models import TABLE_ALUMNI_USERS
from utils.validators import validate_registration_data
from utils.email import send_otp_email, send_password_reset_email, generate_reset_token
from datetime import datetime, timedelta
import random
import string
import os
import json

# Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth, auth

# Initialize Firebase Admin (only once)
_firebase_app = None

def init_firebase():
    global _firebase_app
    if firebase_admin._apps:
        return firebase_admin.get_app()

    # Try environment variable first
    service_account_str = os.environ.get('FIREBASE_SERVICE_ACCOUNT')
    if service_account_str:
        print("Loading Firebase from environment variable")
        service_account_dict = json.loads(service_account_str)
        cred = credentials.Certificate(service_account_dict)
        _firebase_app = firebase_admin.initialize_app(cred)
        print("Firebase initialized from env")
        return _firebase_app

    # Try to find serviceAccountKey.json
    # Search in: backend/, project root/, and parent of project root/
    search_paths = [
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'serviceAccountKey.json'),
        os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'serviceAccountKey.json'),
        os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json'),
    ]

    for service_account_path in search_paths:
        service_account_path = os.path.abspath(service_account_path)
        print(f"Checking Firebase service account at: {service_account_path}")
        if os.path.exists(service_account_path):
            with open(service_account_path, 'r') as f:
                service_account_dict = json.load(f)
            cred = credentials.Certificate(service_account_dict)
            _firebase_app = firebase_admin.initialize_app(cred)
            print(f"Firebase initialized from: {service_account_path}")
            return _firebase_app

    print("ERROR: Could not find serviceAccountKey.json!")
    return None

auth_bp = Blueprint("auth", __name__)

def generate_otp():
    return "".join(random.choices(string.digits, k=6))

def get_authenticated_user_id():
    user_id = request.headers.get("X-Auth-User-Id")
    if not user_id:
        return None
    try:
        return int(user_id)
    except ValueError:
        return None

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True)
    # Capture original password before validation (which hashes it)
    original_password = data.get("password", "")
    validated = validate_registration_data(data)

    if isinstance(validated, str):
        return jsonify({"error": validated}), 400

    try:
        existing_email = execute_query(
            f"SELECT id FROM {TABLE_ALUMNI_USERS} WHERE email=%s",
            (validated["email"],),
            fetch_one=True
        )
        existing_contact = execute_query(
            f"SELECT id FROM {TABLE_ALUMNI_USERS} WHERE contact_number=%s",
            (validated["contact_number"],),
            fetch_one=True
        )

        if existing_email or existing_contact:
            if existing_email and existing_contact:
                error_message = "Email and contact number already exist"
            elif existing_email:
                error_message = "Email already exists"
            else:
                error_message = "Contact number already exists"
            return jsonify({"error": error_message}), 409

        # Generate OTP
        otp = generate_otp()
        password_hash = generate_password_hash(original_password)

        execute_query(
            f"""INSERT INTO {TABLE_ALUMNI_USERS}
            (name,email,password_hash,contact_number,academic_details,specialization,role,email_otp)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
            (
                validated["name"],
                validated["email"],
                password_hash,
                validated["contact_number"],
                json.dumps(validated["academic_details"]),
                validated["specialization"],
                "alumni",
                otp,
            )
        )

        # Send OTP email
        success, error = send_otp_email(validated["email"], otp, validated["name"])
        if not success:
            return jsonify({"error": f"Failed to send OTP: {error}"}), 500

        # Create Firebase user for password reset functionality
        try:
            firebase_app = init_firebase()
            if firebase_app:
                try:
                    firebase_user = firebase_auth.create_user(
                        email=validated["email"],
                        password=original_password,
                        display_name=validated["name"]
                    )
                    print(f"Firebase user created: {firebase_user.uid} for email: {validated['email']}")
                except firebase_auth.EmailAlreadyExistsError:
                    print(f"Firebase user already exists for email: {validated['email']}")
                except Exception as fb_err:
                    print(f"Warning: Failed to create Firebase user: {fb_err}")
                    # Don't fail registration if Firebase user creation fails
        except Exception as fb_init_err:
            print(f"Warning: Firebase not initialized, skipping Firebase user creation: {fb_init_err}")

        return jsonify({
            "message": "Registered successfully. Please verify your email.",
            "email_verified": False,
            "approved": False
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    email = str(data.get("email", "")).strip().lower()
    otp = str(data.get("otp", "")).strip()

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    try:
        user = execute_query(
            f"SELECT id, name, email, email_otp, email_verified FROM {TABLE_ALUMNI_USERS} WHERE email=%s",
            (email,),
            fetch_one=True
        )

        if not user:
            return jsonify({"error": "User not found"}), 404

        if user.get("email_verified"):
            return jsonify({"message": "Email already verified"}), 200

        if user.get("email_otp") != otp:
            return jsonify({"error": "Invalid OTP"}), 401

        # Clear OTP and mark as verified
        execute_query(
            f"UPDATE {TABLE_ALUMNI_USERS} SET email_otp = NULL, email_verified = 1 WHERE id = %s",
            (user["id"],)
        )

        return jsonify({
            "message": "Email verified successfully",
            "email_verified": True
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/resend-otp", methods=["POST"])
def resend_otp():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    email = str(data.get("email", "")).strip().lower()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        user = execute_query(
            f"SELECT id, name, email, email_otp, email_verified FROM {TABLE_ALUMNI_USERS} WHERE email=%s",
            (email,),
            fetch_one=True
        )

        if not user:
            return jsonify({"error": "User not found"}), 404

        if user.get("email_verified"):
            return jsonify({"error": "Email already verified"}), 400

        # Generate new OTP
        otp = generate_otp()
        execute_query(
            f"UPDATE {TABLE_ALUMNI_USERS} SET email_otp = %s WHERE id = %s",
            (otp, user["id"])
        )

        # Send OTP email
        success, error = send_otp_email(user["email"], otp, user["name"])
        if not success:
            return jsonify({"error": f"Failed to send OTP: {error}"}), 500

        return jsonify({"message": "OTP sent successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    email = str(data.get("email", "")).strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        user = execute_query(
            f"SELECT * FROM {TABLE_ALUMNI_USERS} WHERE email=%s",
            (email,),
            fetch_one=True
        )

        if not user or not check_password_hash(user["password_hash"], password):
            return jsonify({"error": "Invalid credentials"}), 401

        if user.get("role") == "admin":
            return jsonify({
                "message": "Login successful",
                "role": "admin",
                "userId": user.get("id"),
                "approved": True,
            }), 200

        # Check email verification
        email_verified = bool(user.get("email_verified"))
        is_approved = bool(user.get("is_approved"))

        if not email_verified:
            return jsonify({
                "error": "Please verify your email first",
                "email_verified": False,
                "approved": is_approved,
            }), 403

        if not is_approved:
            return jsonify({
                "error": "Your account is pending admin approval",
                "email_verified": True,
                "approved": False,
            }), 403

        return jsonify({
            "message": "Login successful",
            "role": "alumni",
            "userId": user.get("id"),
            "email_verified": True,
            "approved": True,
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/firebase/login", methods=["POST"])
def firebase_login():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    id_token = data.get("id_token", "")
    if not id_token:
        return jsonify({"error": "ID token is required"}), 400

    try:
        firebase_app = init_firebase()
        if firebase_app is None:
            return jsonify({"error": "Firebase not initialized. Check server logs."}), 500
        decoded_token = firebase_auth.verify_id_token(id_token)
        email = decoded_token.get("email", "").lower()

        if not email:
            return jsonify({"error": "Email not found in Firebase token"}), 400

        user = execute_query(
            f"SELECT * FROM {TABLE_ALUMNI_USERS} WHERE email=%s",
            (email,),
            fetch_one=True
        )

        if not user:
            return jsonify({
                "error": "Account not found. Please register first.",
                "needs_registration": True,
            }), 404

        if user.get("role") == "admin":
            return jsonify({
                "message": "Login successful",
                "role": "admin",
                "userId": user.get("id"),
                "approved": True,
            }), 200

        email_verified = bool(user.get("email_verified"))
        is_approved = bool(user.get("is_approved"))

        if not email_verified:
            return jsonify({
                "error": "Please verify your email first",
                "email_verified": False,
            }), 403

        if not is_approved:
            return jsonify({
                "error": "Your account is pending admin approval",
                "email_verified": True,
                "approved": False,
            }), 403

        return jsonify({
            "message": "Login successful",
            "role": "alumni",
            "userId": user.get("id"),
            "email_verified": True,
            "approved": True,
        }), 200

    except firebase_auth.InvalidIdTokenError:
        return jsonify({"error": "Invalid Firebase token"}), 401
    except firebase_auth.ExpiredIdTokenError:
        return jsonify({"error": "Firebase token expired"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/firebase/register", methods=["POST"])
def firebase_register():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    id_token = data.get("id_token", "")
    if not id_token:
        return jsonify({"error": "ID token is required"}), 400

    name = data.get("name", "")
    phone = data.get("phone", "")
    academic_details = data.get("academic_details", [])

    specialization = data.get("specialization", "")

    if not all([name, phone, specialization]) or not academic_details:
        return jsonify({"error": "Missing registration fields"}), 400

    try:
        firebase_app = init_firebase()
        if firebase_app is None:
            return jsonify({"error": "Firebase not initialized. Check server logs."}), 500
        decoded_token = firebase_auth.verify_id_token(id_token)
        email = decoded_token.get("email", "").lower()

        if not email:
            return jsonify({"error": "Email not found in Firebase token"}), 400

        existing = execute_query(
            f"SELECT id FROM {TABLE_ALUMNI_USERS} WHERE email=%s",
            (email,),
            fetch_one=True
        )

        if existing:
            return jsonify({"error": "Email already registered"}), 409

        execute_query(
            f"""INSERT INTO {TABLE_ALUMNI_USERS}
            (name,email,contact_number,academic_details,specialization,role,email_verified,is_approved)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
            (
                name,
                email,
                phone,
                json.dumps(academic_details),
                specialization,
                "alumni",
                1,
                0,
            )
        )

        return jsonify({
            "message": "Registered successfully. Waiting for admin approval.",
            "approved": False,
            "email_verified": True,
        }), 201

    except firebase_auth.InvalidIdTokenError:
        return jsonify({"error": "Invalid Firebase token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/user-status", methods=["GET"])
def user_status():
    email = request.args.get("email", "").strip().lower()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        user = execute_query(
            f"SELECT email_verified, is_approved, role FROM {TABLE_ALUMNI_USERS} WHERE email=%s",
            (email,),
            fetch_one=True
        )

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "email_verified": bool(user.get("email_verified")),
            "is_approved": bool(user.get("is_approved")),
            "role": user.get("role"),
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@auth_bp.route("/profile", methods=["GET"])
def get_profile():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        user = execute_query(
            f"SELECT id, name, email, contact_number, academic_details, specialization, awards, honorary_degrees, books_authored, other_accolades, previous_experience FROM {TABLE_ALUMNI_USERS} WHERE id=%s",
            (user_id,),
            fetch_one=True
        )

        if not user:
            return jsonify({"error": "User not found"}), 404

        for key in ["academic_details", "awards", "honorary_degrees", "books_authored", "other_accolades", "previous_experience"]:
            value = user.get(key)
            if value is None:
                user[key] = []
            else:
                try:
                    user[key] = json.loads(value) if isinstance(value, str) else value
                except Exception:
                    user[key] = []

        return jsonify(user), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/profile", methods=["PUT"])
def update_profile():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    allowed_fields = [
        "name",
        "contact_number",
        "academic_details",
        "specialization",
        "awards",
        "honorary_degrees",
        "books_authored",
        "other_accolades",
        "previous_experience",
    ]

    updates = []
    params = []
    json_fields = {
        "academic_details",
        "awards",
        "honorary_degrees",
        "books_authored",
        "other_accolades",
        "previous_experience",
    }

    for field in allowed_fields:
        if field not in data:
            continue

        value = data.get(field)
        if field in json_fields:
            if value is None or value == []:
                value = None
            else:
                try:
                    value = json.dumps(value)
                except Exception:
                    return jsonify({"error": f"Invalid data for {field}"}), 400

        updates.append(f"{field} = %s")
        params.append(value)

    if not updates:
        return jsonify({"error": "No profile fields provided"}), 400

    query = f"UPDATE {TABLE_ALUMNI_USERS} SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
    params.append(user_id)

    try:
        execute_query(query, tuple(params))
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    email = data.get("email", "").strip().lower()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        # Check if user exists in local database
        user = execute_query(
            f"SELECT id, name, email FROM {TABLE_ALUMNI_USERS} WHERE email=%s",
            (email,),
            fetch_one=True
        )

        # For security, always return success whether user exists or not
        # This prevents email enumeration attacks
        if user:
            # Generate secure token
            reset_token = generate_reset_token()
            # Token expires in 15 minutes
            token_expiry = datetime.now() + timedelta(minutes=15)

            # Store token in database
            execute_query(
                f"UPDATE {TABLE_ALUMNI_USERS} SET password_reset_token=%s, token_expiry=%s WHERE id=%s",
                (reset_token, token_expiry, user["id"])
            )

            # Send password reset email with secure button link
            success, error = send_password_reset_email(user["email"], reset_token, user["name"])
            if not success:
                print(f"Failed to send password reset email: {error}")
                # Don't reveal email sending failure to user

        return jsonify({
            "message": "If an account exists with this email, you will receive password reset instructions"
        }), 200

    except Exception as e:
        print(f"Error in forgot_password: {str(e)}")
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    token = data.get("token", "").strip()
    new_password = data.get("newPassword", "")

    if not token:
        return jsonify({"error": "Invalid reset token"}), 400

    if not new_password or len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    try:
        # Find user with this token
        user = execute_query(
            f"SELECT id, email, password_reset_token, token_expiry FROM {TABLE_ALUMNI_USERS} WHERE password_reset_token=%s",
            (token,),
            fetch_one=True
        )

        if not user:
            return jsonify({"error": "Invalid reset link. Please request a new one."}), 400

        # Check if token has expired
        if user.get("token_expiry"):
            expiry = user["token_expiry"]
            if isinstance(expiry, str):
                expiry = datetime.strptime(expiry, "%Y-%m-%d %H:%M:%S")
            if expiry < datetime.now():
                # Clear expired token
                execute_query(
                    f"UPDATE {TABLE_ALUMNI_USERS} SET password_reset_token=NULL, token_expiry=NULL WHERE id=%s",
                    (user["id"],)
                )
                return jsonify({"error": "Reset link has expired. Please request a new one."}), 400

        # Update password in local database
        password_hash = generate_password_hash(new_password)
        execute_query(
            f"UPDATE {TABLE_ALUMNI_USERS} SET password_hash=%s, password_reset_token=NULL, token_expiry=NULL WHERE id=%s",
            (password_hash, user["id"])
        )
        print(f"Password updated in local DB for: {user['email']}")

        # Update password in Firebase if user exists there
        try:
            init_firebase()
            if _firebase_app:
                firebase_auth.update_user(
                    user["email"],
                    password=new_password
                )
                print(f"Password updated in Firebase for: {user['email']}")
        except Exception as fb_err:
            print(f"Warning: Could not update Firebase password: {fb_err}")
            # Continue - local password update was successful

        return jsonify({
            "message": "Password has been reset successfully"
        }), 200

    except Exception as e:
        print(f"Error in reset_password: {str(e)}")
        return jsonify({"error": str(e)}), 500


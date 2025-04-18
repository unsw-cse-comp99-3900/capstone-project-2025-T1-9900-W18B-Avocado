from flask_jwt_extended import get_jwt_identity, jwt_required
from app.services.user_service import register_user, login_user, get_user, get_all_users
from flask import Blueprint, request, jsonify
from app.services.user_service import (
    handle_email_verification,
    handle_email_registration_code,
    handle_password_reset,
    get_reward_status
)
from app.utils.logger import get_logger

user_bp = Blueprint('user_bp', __name__)
logger = get_logger("user-service")


@user_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user = get_jwt_identity()
    logger.info("GET /profile", extra={"user": user})
    response, code = get_user(user)
    return jsonify(response), code


@user_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    logger.info("POST /register", extra={"email": data.get("email")})
    response, code = register_user(data)
    return jsonify(response), code


@user_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    logger.info("POST /login", extra={"email": data.get("email")})
    response, code = login_user(data.get("email"), data.get("password"))
    return jsonify(response), code


@user_bp.route("/validate-and-send", methods=["POST"])
def validate_and_send():
    data = request.get_json()
    email = data.get("email")
    logger.info("POST /validate-and-send", extra={"email": email})

    if not email:
        logger.warning(" Email missing in /validate-and-send request")
        return jsonify({"error": "Email is required"}), 400

    response, status = handle_email_verification(email)
    return jsonify(response), status


@user_bp.route("/send-email-code", methods=["POST"])
def send_email_code():
    data = request.get_json()
    email = data.get("email")
    logger.info("POST /send-email-code", extra={"email": email})

    if not email:
        logger.warning(" Email missing in /send-email-code request")
        return jsonify({"error": "Email is required"}), 400

    response, status = handle_email_registration_code(email)
    return jsonify(response), status


@user_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")
    new_password = data.get("new_password")
    logger.info("POST /reset-password", extra={"email": email})

    if not email or not code or not new_password:
        logger.warning(" Missing fields in /reset-password request", extra={"email": email})
        return jsonify({"error": "Missing required fields."}), 400

    response, status = handle_password_reset(email, code, new_password)
    return jsonify(response), status


@user_bp.route("/userlist", methods=["GET"])
@jwt_required()
def get_user_list():
    identity = get_jwt_identity()
    logger.info("GET /userlist", extra={"requester": identity})
    response, code = get_all_users()
    return jsonify(response), code


@user_bp.route("/rewards/status", methods=["GET"])
@jwt_required()
def reward_status():
    identity = get_jwt_identity()
    student_id = identity.get("studentID")
    logger.info("GET /rewards/status", extra={"studentID": student_id})

    if not student_id:
        logger.warning(" Missing studentID in token for /rewards/status")
        return jsonify({"error": "Missing studentID in token"}), 400

    response, status = get_reward_status(student_id)
    return jsonify(response), status

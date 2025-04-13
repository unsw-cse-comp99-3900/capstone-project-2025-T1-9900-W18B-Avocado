from flask_jwt_extended import get_jwt_identity, jwt_required
from app.services.user_service import register_user, login_user, get_user, get_all_users
from flask import Blueprint, request, jsonify
from app.services.user_service import handle_email_verification
from app.services.user_service import handle_email_registration_code
from app.services.user_service import handle_password_reset
from app.services.user_service import get_reward_status
from app.utils.logger import get_logger

user_bp = Blueprint('user_bp', __name__)
logger = get_logger("user-service")

@user_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user = get_jwt_identity()
    response, code = get_user(user)
    return jsonify(response), code

@user_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    response, code = register_user(data)
    return jsonify(response), code

@user_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    response, code = login_user(data.get("email"), data.get("password"))
    logger.info("Login attempt", extra={"email": data.get("email")})
    return jsonify(response), code

@user_bp.route("/validate-and-send", methods=["POST"])
def validate_and_send():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    response, status = handle_email_verification(email)
    return jsonify(response), status

@user_bp.route("/send-email-code", methods=["POST"])
def send_email_code():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    response, status = handle_email_registration_code(email)
    return jsonify(response), status
@user_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")
    new_password = data.get("new_password")

    if not email or not code or not new_password:
        return jsonify({"error": "Missing required fields."}), 400

    response, status = handle_password_reset(email, code, new_password)
    return jsonify(response), status

@user_bp.route("/userlist", methods=["GET"])
@jwt_required()
def get_user_list():
    response, code = get_all_users()
    return jsonify(response), code


@user_bp.route("/rewards/status", methods=["GET"])
@jwt_required()
def reward_status():
    student_id = get_jwt_identity().get("studentID")
    if not student_id:
        return jsonify({"error": "Missing studentID in token"}), 400

    response, status = get_reward_status(student_id)
    return jsonify(response), status
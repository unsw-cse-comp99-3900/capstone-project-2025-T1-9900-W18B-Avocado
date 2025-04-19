from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import Blueprint, request, jsonify
from app.utils.logger import get_logger
from app.services.analysis_service import get_skill_summary

analysis_bp = Blueprint('analysis_bp', __name__)
logger = get_logger("analysis-service")

@analysis_bp.route("/internal/skill_summary/<int:student_id>", methods=["GET"])
def skill_summary(student_id):
    result, status = get_skill_summary(student_id)
    return jsonify(result), status
# app/routes/event_routes.py
from app.utils.auth import check_admin
from app.utils.logger import get_logger
from flask import Blueprint, request, jsonify
from app.services.event_service import (
    create_event, get_event_list, update_event, delete_event,
    register_event, get_student_events, get_previous_events,
    checkin_event, redeem_reward, attend_event, delete_selected_events,get_event_history
)
from flask_jwt_extended import jwt_required, get_jwt_identity

event_bp = Blueprint("event_bp", __name__)
logger = get_logger("event-service")


@event_bp.route("/admin/create_event", methods=["POST"])
@jwt_required()
def create_event_route():
    logger.info("POST /admin/create_event")
    auth_error = check_admin()
    if auth_error:
        logger.warning(" Admin check failed")
        return auth_error

    try:
        response, status = create_event(request.form, request.files)
        logger.info("✅ Event created", extra={"status": status})
        return jsonify(response), status
    except Exception as e:
        logger.exception(" Failed to create event")
        return jsonify({"error": str(e)}), 500


@event_bp.route("/event_list", methods=["GET"])
@jwt_required()
def get_event_list_route():
    filter_type = request.args.get("filter", "all")
    page = int(request.args.get("page", 1))
    search = request.args.get("search")
    tag = request.args.get("tag")
    category = request.args.get("category")

    logger.info("GET /event_list", extra={
        "filter": filter_type, "page": page, "search": search, "tag": tag, "category": category
    })
    try:
        result = get_event_list(filter_type, page, search, tag, category)
        return jsonify(result), 200
    except Exception as e:
        logger.exception(" Failed to get event list")
        return jsonify({"error": str(e)}), 500


@event_bp.route("/admin/update_event", methods=["POST"])
@jwt_required()
def update_event_route():
    form = request.form
    new_image = request.files.get("image")
    event_id = form.get("eventID")
    logger.info("POST /admin/update_event", extra={"eventID": event_id})

    if not event_id:
        logger.warning(" Missing eventID")
        return jsonify({"error": "Missing eventID in form data"}), 400

    try:
        response, status = update_event(event_id, form, new_image)
        return jsonify(response), status
    except Exception as e:
        logger.exception(" Failed to update event")
        return jsonify({"error": str(e)}), 500


@event_bp.route("/admin/delete_event/<int:event_id>", methods=["DELETE"])
@jwt_required()
def delete_event_route(event_id):
    logger.info("DELETE /admin/delete_event", extra={"eventID": event_id})
    response, status = delete_event(event_id)
    return jsonify(response), status


@event_bp.route("/admin/delete_selected", methods=["POST"])
@jwt_required()
def delete_selected_events_route():
    data = request.get_json()
    event_ids = data.get("eventIDs")
    logger.info("POST /admin/delete_selected", extra={"eventIDs": event_ids})
    response, status = delete_selected_events(event_ids)
    return jsonify(response), status


@event_bp.route("/register_event", methods=["POST"])
@jwt_required()
def register_event_route():
    data = request.get_json() or request.form
    logger.info("POST /register_event", extra={"studentID": get_jwt_identity().get("studentID")})
    response, status = register_event(data)
    return jsonify(response), status


@event_bp.route("/my_event", methods=["GET"])
@jwt_required()
def my_event():
    identity = get_jwt_identity()
    student_id = identity.get("studentID")
    role = identity.get("role")
    logger.info("GET /my_event", extra={"studentID": student_id, "role": role})

    if role != "student":
        logger.warning(" Non-student tried to access /my_event", extra={"role": role})
        return jsonify({"error": "Only students can access this endpoint"}), 403

    page = request.args.get("page", default=1, type=int)
    filter_type = request.args.get("filter", default="previous", type=str)

    result, status = get_student_events(student_id, page, filter_type)
    return jsonify(result), status


@event_bp.route("/past_event", methods=["GET"])
@jwt_required()
def get_my_events_route():
    identity = get_jwt_identity()
    student_id = identity.get("studentID")
    page = int(request.args.get("page", 1))
    filter_type = request.args.get("filter", "all")

    logger.info("GET /past_event", extra={"studentID": student_id, "page": page, "filter": filter_type})
    try:
        response, status = get_previous_events(student_id, page, filter_type)
        return jsonify(response), status
    except Exception as e:
        logger.exception(" Failed to fetch past events")
        return jsonify({"error": str(e)}), 500


@event_bp.route("/checkin/<int:event_id>", methods=["PATCH"])
@jwt_required()
def checkin_route(event_id):
    student_id = get_jwt_identity().get("studentID")
    logger.info("PATCH /checkin", extra={"studentID": student_id, "eventID": event_id})

    if not student_id:
        logger.warning(" Missing studentID in token")
        return jsonify({"error": "Missing studentID in token"}), 400

    response, status = checkin_event(student_id, event_id)
    return jsonify(response), status


@event_bp.route("/rewards/redeem", methods=["POST"])
@jwt_required()
def redeem_reward_route():
    data = request.get_json()
    reward_id = data.get("rewardID")
    student_id = get_jwt_identity().get("studentID")
    logger.info("POST /rewards/redeem", extra={"studentID": student_id, "rewardID": reward_id})

    if not reward_id:
        logger.warning(" Missing rewardID in redeem request")
        return jsonify({"error": "Missing rewardID"}), 400

    response, status = redeem_reward(student_id, reward_id)
    return jsonify(response), status


@event_bp.route("/event/attend", methods=["POST"])
@jwt_required()
def attend_event_route():
    data = request.get_json()
    event_id = data.get("eventId")
    student_id = get_jwt_identity().get("studentID")
    logger.info("POST /event/attend", extra={"studentID": student_id, "eventID": event_id})

    if not event_id:
        logger.warning(" Missing eventID in attend request")
        return jsonify({"error": "Missing eventID"}), 400

    response, status = attend_event(event_id, student_id)
    return jsonify(response), status

@event_bp.route("/internal/event_history/<int:student_id>", methods=["GET"])
def student_event_history(student_id):
    result, status = get_event_history(student_id)
    return jsonify(result), status


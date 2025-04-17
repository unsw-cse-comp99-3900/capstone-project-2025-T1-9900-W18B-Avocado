# app/routes/event_routes.py
from app.utils.auth import check_admin
from flask import Blueprint, request, jsonify
from app.services.event_service import create_event
from app.services.event_service import get_event_list
from app.services.event_service import update_event
from app.services.event_service import delete_event
from app.services.event_service import register_event
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.event_service import get_student_events
from app.services.event_service import checkin_event
from app.services.event_service import redeem_reward
from app.services.event_service import attend_event
from app.services.event_service import delete_selected_events
event_bp = Blueprint("event_bp", __name__)


@event_bp.route("/admin/create_event", methods=["POST"])
@jwt_required()
def create_event_route():
    """
    管理端：创建 Event，接收 form 表单数据
    """
    auth_error = check_admin()
    if auth_error:
        return auth_error  # ✅ 权限错误，提前返回

    print(request.files)
    try:
        response, status = create_event(request.form, request.files)
        return jsonify(response), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_bp.route("/event_list", methods=["GET"])
@jwt_required()
def get_event_list_route():
    filter_type = request.args.get("filter", "all")
    page = int(request.args.get("page", 1))
    search = request.args.get("search")
    tag = request.args.get("tag")
    category = request.args.get("category")  # ⬅️ 新增字段

    try:
        result = get_event_list(filter_type, page, search, tag, category)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_bp.route("/admin/update_event", methods=["POST"])
@jwt_required()
def update_event_route():
    form = request.form
    new_image = request.files.get("image")  # 可为空

    try:
        event_id = form.get("eventID")
        if not event_id:
            return jsonify({"error": "Missing eventID in form data"}), 400

        response, status = update_event(event_id, form, new_image)
        return jsonify(response), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@event_bp.route("/admin/delete_event/<int:event_id>", methods=["DELETE"])
@jwt_required()
def delete_event_route(event_id):
    """
    管理端：删除指定 eventID 的活动
    """
    response, status = delete_event(event_id)
    return jsonify(response), status

@event_bp.route("/admin/delete_selected", methods=["POST"])
@jwt_required()
def delete_selected_events_route():
    data = request.get_json()
    event_ids = data.get("eventIDs")

    response, status = delete_selected_events(event_ids)
    return jsonify(response), status

@event_bp.route("/register_event", methods=["POST"])
@jwt_required()
def register_event_route():
    data = request.get_json() or request.form
    response, status = register_event(data)
    return jsonify(response), status


@event_bp.route("/my_event", methods=["GET"])
@jwt_required()
def my_event():
    identity = get_jwt_identity()
    student_id = identity.get("studentID")
    role = identity.get("role")

    if role != "student":
        return jsonify({"error": "Only students can access this endpoint"}), 403

    # 接收分页和过滤参数
    page = request.args.get("page", default=1, type=int)
    filter_type = request.args.get("filter", default="all", type=str)

    result, status = get_student_events(student_id, page, filter_type)
    return jsonify(result), status

@event_bp.route("/checkin/<int:event_id>", methods=["PATCH"])
@jwt_required()
def checkin_route(event_id):
    identity = get_jwt_identity()
    student_id = identity.get("studentID")

    if not student_id:
        return jsonify({"error": "Missing studentID in token"}), 400

    response, status = checkin_event(student_id, event_id)
    return jsonify(response), status

@event_bp.route("/rewards/redeem", methods=["POST"])
@jwt_required()
def redeem_reward_route():
    data = request.get_json()
    reward_id = data.get("rewardID")

    if not reward_id:
        return jsonify({"error": "Missing rewardID"}), 400

    student_id = get_jwt_identity().get("studentID")

    response, status = redeem_reward(student_id, reward_id)
    return jsonify(response), status


@event_bp.route("/event/attend", methods=["POST"])
@jwt_required()
def attend_event_route():
    data = request.get_json()
    event_id = data.get("eventId")
    student_id = get_jwt_identity().get("studentID")  # 从 JWT 中获取 studentID
    print(event_id)
    print(student_id)
    if not event_id:
        return jsonify({"error": "Missing eventID"}), 400

    response, status = attend_event(event_id, student_id)
    return jsonify(response), status


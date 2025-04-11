# app/routes/event_routes.py

from flask import Blueprint, request, jsonify
from app.services.event_service import create_event
from app.services.event_service import get_event_list
from app.services.event_service import update_event
from app.services.event_service import delete_event
from app.services.event_service import register_event
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.event_service import get_student_events
from app.services.event_service import checkin_event

event_bp = Blueprint("event_bp", __name__)


@event_bp.route("/admin/create_event", methods=["POST"])
def create_event_route():
    """
    管理端：创建 Event，接收 form 表单数据
    """
    print(request.files)
    try:
        response, status = create_event(request.form, request.files)
        return jsonify(response), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_bp.route("/event_list", methods=["GET"])
def get_event_list_route():
    """
    获取事件列表，支持分页、时间过滤、名称搜索、标签筛选
    参数:
        ?filter=all|current|previous|upcoming
        ?page=1
        ?search=keyword        # 可选，模糊匹配 name 字段
        ?tag=someTag           # 可选，模糊匹配 tag 字段
    """
    filter_type = request.args.get("filter", "all")
    page = int(request.args.get("page", 1))
    search = request.args.get("search")  # 可为 None
    tag = request.args.get("tag")        # 可为 None

    try:
        result = get_event_list(filter_type, page, search, tag)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_bp.route("/admin/update_event", methods=["POST"])
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

def delete_event_route(event_id):
    """
    管理端：删除指定 eventID 的活动
    """
    response, status = delete_event(event_id)
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
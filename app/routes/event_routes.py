# app/routes/event_routes.py

from flask import Blueprint, request, jsonify
from app.services.event_service import create_event
from app.services.event_service import get_event_list
from app.services.event_service import update_event
from app.services.event_service import delete_event
from app.services.event_service import register_event

event_bp = Blueprint("event_bp", __name__)


@event_bp.route("/admin/create_event", methods=["POST"])
def create_event_route():
    """
    管理端：创建 Event，接收 form 表单数据
    """
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


@event_bp.route("/admin/update-event/<int:event_id>", methods=["PUT"])
def update_event_route(event_id):
    form = request.form
    try:
        response, status = update_event(event_id, form)
        return jsonify(response), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_bp.route("/admin/delete-event/<int:event_id>", methods=["DELETE"])
def delete_event_route(event_id):
    """
    管理端：删除指定 eventID 的活动
    """
    response, status = delete_event(event_id)
    return jsonify(response), status

@event_bp.route("/register-event", methods=["POST"])
def register_event_route():
    data = request.get_json() or request.form
    response, status = register_event(data)
    return jsonify(response), status
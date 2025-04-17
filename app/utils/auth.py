from flask_jwt_extended import get_jwt_identity
from flask import jsonify

def check_admin():
    try:
        identity = get_jwt_identity()
        if not identity or identity.get("role") != "admin":
            return jsonify({"error": "Admin access required"}), 403
    except Exception as e:
        return jsonify({"error": f"JWT invalid: {str(e)}"}), 401
    return None  # 通过校验返回 None
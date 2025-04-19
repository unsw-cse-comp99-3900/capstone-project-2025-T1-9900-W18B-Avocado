from flask_jwt_extended import create_access_token
from app.models.db import get_db_connection
from app.utils.auth import hash_password, verify_password
from app.utils.code import generate_code, store_code
from app.utils.email_sender import send_email_verification
from app.utils.code import verify_code, remove_code
from collections import defaultdict
from app.nacos.client import nacos_client
import requests
from app.utils.nacos_utils import get_service_url


def register_user(data):
    is_arc_member = str(data["isArcMember"]).upper() == "TRUE"
    required_fields = ["studentID", "email", "name", "faculty", "degree",
                       "citizenship", "isArcMember", "graduationYear", "role", "password", "emailCode"]
    missing = [f for f in required_fields if f not in data or data[f] in [None, ""]]
    if missing:
        return {"error": f"Missing fields: {', '.join(missing)}"}, 400

    # ✉️ 校验邮箱验证码
    if not verify_code(data["email"], data["emailCode"]):
        return {"error": "Invalid or expired email verification code."}, 400

    conn = get_db_connection()
    if not conn:
        return {"error": "Database connection failed"}, 500

    try:
        cursor = conn.cursor()

        # ⚠️ 检查邮箱和学号是否重复
        cursor.execute("SELECT 1 FROM userdata WHERE email = %s", (data['email'],))
        if cursor.fetchone():
            return {"error": "Email already exists."}, 400

        cursor.execute("SELECT 1 FROM userdata WHERE studentID = %s", (data['studentID'],))
        if cursor.fetchone():
            return {"error": "Student ID already exists."}, 400

        # 🔐 加密密码
        hashed = hash_password(data["password"])

        # 📝 插入 student 数据（含 points = 0）
        cursor.execute("""
            INSERT INTO studentdata
            (studentID, email, name, faculty, degree, citizenship, isArcMember, graduationYear, role, points)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data["studentID"], data["email"], data["name"], data["faculty"],
            data["degree"], data["citizenship"], int(is_arc_member),
            int(data["graduationYear"]), data["role"], 0
        ))

        # 🔐 插入登录信息
        cursor.execute("""
            INSERT INTO userdata 
            (studentID, email, password, role, active, name)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data["studentID"], data["email"], hashed, data["role"], 1, data["name"]
        ))

        conn.commit()

        # ✅ 删除验证码记录
        remove_code(data["email"])

        return {"message": "User registered successfully."}, 201

    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def login_user(email, password):
    conn = get_db_connection()
    if not conn:
        return {"error": "DB failed"}, 500

    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT studentID, password, role, active FROM userdata WHERE email = %s",
            (email,)
        )
        user = cursor.fetchone()

        if not user:
            return {"error": "Invalid credentials"}, 401

        studentID, hashed, role, active = user

        # 检查是否被禁用
        if active == 0:
            return {"error": "Account is disabled. Please contact admin."}, 403

        # 验证密码
        if verify_password(hashed, password):
            userData = {"studentID": studentID, "role": role}
            return {
                "message": "Login successful",
                "studentID": studentID,
                "role": role,
                "token": create_access_token(identity=userData)
            }, 200

        return {"error": "Invalid credentials"}, 401

    except Exception as e:
        return {"error": str(e)}, 500

    finally:
        cursor.close()
        conn.close()



def check_email_exists(email):
    print(email)
    conn = get_db_connection()
    if not conn:
        return False
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM userdata WHERE email = %s", (email,))
        return cursor.fetchone() is not None
    finally:
        cursor.close()
        conn.close()

def handle_email_verification(email):
    if not check_email_exists(email):
        return {"error": "Email is not registered."}, 400

    code = generate_code()
    store_code(email, code)

    success = send_email_verification(email, code)
    if not success:
        return {"error": "Failed to send verification code."}, 500

    return {"message": "Verification code has been sent. Please check your email."}, 200

def handle_email_registration_code(email):
    # 若邮箱已注册，拒绝注册
    if check_email_exists(email):
        return {"error": "This email is already registered."}, 400

    code = generate_code()
    store_code(email, code)

    success = send_email_verification(email, code)
    if not success:
        return {"error": "Failed to send verification code."}, 500

    return {"message": "Verification code sent. Please check your email."}, 200

def handle_password_reset(email, code_input, new_password):
    # 1. 验证码校验
    if not verify_code(email, code_input):
        return {"error": "Invalid or expired verification code."}, 400

    conn = get_db_connection()
    if not conn:
        return {"error": "Database connection failed."}, 500

    try:
        cursor = conn.cursor()

        # 2. 查询旧密码
        cursor.execute("SELECT password FROM userdata WHERE email = %s", (email,))
        result = cursor.fetchone()
        if not result:
            return {"error": "Email not found."}, 400

        old_hashed = result[0]

        # 3. 判断新密码是否与旧密码一致（加密前比对）
        if verify_password(old_hashed, new_password):
            return {"error": "New password cannot be the same as the old password."}, 400

        # 4. 更新密码
        new_hashed = hash_password(new_password)
        cursor.execute("UPDATE userdata SET password = %s WHERE email = %s", (new_hashed, email))
        conn.commit()

        # 5. 清除验证码
        remove_code(email)

        return {"message": "Password has been reset successfully."}, 200

    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

def get_all_users():
    conn = get_db_connection()
    if not conn:
        return {"error": "Database connection failed"}, 500
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM userdata")
        users = cursor.fetchall()
        return {"users": users}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def get_user(user):
    conn = get_db_connection()
    if not conn:
        return {"error": "Database connection failed"}, 500

    try:
        cursor = conn.cursor(dictionary=True)
        studentID = user["studentID"]
        role = user["role"]

        cursor.execute("SELECT * FROM studentdata WHERE studentID = %s", (studentID,))
        user_data = cursor.fetchone()

        if not user_data:
            return {"error": "User not found"}, 404

        # ✅ 加入 reward 分数字段（即 studentdata.points）
        user_data["reward"] = user_data.get("points", 0)

        # ✅ 跨服务请求 event-service 获取报名历史信息
        try:
            base_url = get_service_url("event-service")
            res = requests.get(f"{base_url}/internal/event_history/{studentID}", timeout=3)

            if res.status_code == 200:
                event_data = res.json()
                user_data["eventHistory"] = event_data.get("eventHistory", [])
                user_data["eventCount"] = event_data.get("total", 0)
            else:
                user_data["eventHistory"] = []
                user_data["eventCount"] = 0
        except Exception as e:
            print(f"❌ Error calling event-service: {e}")
            user_data["eventHistory"] = []
            user_data["eventCount"] = 0

        # ✅ 跨服务请求 analysis-service 获取软技能评分与教练分析
        try:
            base_url = get_service_url("analysis-service")
            res = requests.get(f"{base_url}/internal/skill_summary/{studentID}", timeout=3)

            if res.status_code == 200:
                analysis_data = res.json()
                user_data["skillScores"] = analysis_data.get("skillScores", {})
                user_data["coachAnalysis"] = analysis_data.get("coachAnalysis", "")
            else:
                user_data["skillScores"] = {}
                user_data["coachAnalysis"] = ""
        except Exception as e:
            print(f"❌ Error calling analysis-service: {e}")
            user_data["skillScores"] = {}
            user_data["coachAnalysis"] = ""

        return user_data, 200

    except Exception as e:
        return {"error": str(e)}, 500

    finally:
        cursor.close()
        conn.close()

def get_reward_status(student_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # 查询学生积分
        cursor.execute("SELECT points FROM studentdata WHERE studentID = %s", (student_id,))
        student = cursor.fetchone()
        if not student:
            return {"error": "Student not found"}, 404

        # 查询全部兑换记录（按时间降序）
        cursor.execute("""
            SELECT rewardID, timestamp
            FROM rewarddata
            WHERE studentID = %s
            ORDER BY timestamp DESC
        """, (student_id,))
        all_records = cursor.fetchall()

        # reward 数量统计
        reward_counts = {1: 0, 2: 0, 3: 0}
        for r in all_records:
            rid = r["rewardID"]
            if rid in reward_counts:
                reward_counts[rid] += 1

        # 格式化时间字段
        for r in all_records:
            r["timestamp"] = r["timestamp"].strftime("%Y-%m-%d %H:%M:%S")

        return {
            "studentID": student_id,
            "points": student["points"],
            "rewardCounts": reward_counts,
            "records": all_records
        }, 200

    except Exception as e:
        return {"error": str(e)}, 500

    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

def toggle_status(user, userID):
    conn = get_db_connection()
    if not conn:
        return {"error": "Database connection failed"}, 500
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("UPDATE userdata SET active=active^1 WHERE studentId = %s", (userID,))
        conn.commit()
        return {}, 201

    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
        
def toggle_status_multi(user, userIDs):
    conn = get_db_connection()
    if not conn:
        return {"error": "Database connection failed"}, 500
    try:
        cursor = conn.cursor(dictionary=True)
        for userID in userIDs:
            cursor.execute("UPDATE userdata SET active=active^1 WHERE studentId = %s", (userID,))
        conn.commit()
        return {}, 201

    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
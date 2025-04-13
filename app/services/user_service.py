from flask_jwt_extended import create_access_token
from app.models.db import get_db_connection
from app.utils.auth import hash_password, verify_password
from app.utils.code import generate_code, store_code
from app.utils.email_sender import send_email_verification
from app.utils.code import verify_code, remove_code
from collections import defaultdict

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
        cursor.execute("SELECT 1 FROM userData WHERE email = %s", (data['email'],))
        if cursor.fetchone():
            return {"error": "Email already exists."}, 400

        cursor.execute("SELECT 1 FROM userData WHERE studentID = %s", (data['studentID'],))
        if cursor.fetchone():
            return {"error": "Student ID already exists."}, 400

        # 🔐 加密密码
        hashed = hash_password(data["password"])

        # 📝 插入 student 数据（含 points = 0）
        cursor.execute("""
            INSERT INTO studentData
            (studentID, email, name, faculty, degree, citizenship, isArcMember, graduationYear, role, points)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data["studentID"], data["email"], data["name"], data["faculty"],
            data["degree"], data["citizenship"], int(is_arc_member),
            int(data["graduationYear"]), data["role"], 0
        ))

        # 🔐 插入登录信息
        cursor.execute("""
            INSERT INTO userData 
            (studentID, email, password, role)
            VALUES (%s, %s, %s, %s)
        """, (
            data["studentID"], data["email"], hashed, data["role"]
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
        cursor.execute("SELECT studentID, password, role FROM userData WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return {"error": "Invalid credentials"}, 401
        studentID, hashed, role = user
        if verify_password(hashed, password):
            userData = {"studentID": studentID, "role": role}
            return {"message": "Login successful", "studentID": studentID, "role": role, "token": create_access_token(identity=userData)}, 200
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
        cursor.execute("SELECT 1 FROM userData WHERE email = %s", (email,))
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
        cursor.execute("SELECT password FROM userData WHERE email = %s", (email,))
        result = cursor.fetchone()
        if not result:
            return {"error": "Email not found."}, 400

        old_hashed = result[0]

        # 3. 判断新密码是否与旧密码一致（加密前比对）
        if verify_password(old_hashed, new_password):
            return {"error": "New password cannot be the same as the old password."}, 400

        # 4. 更新密码
        new_hashed = hash_password(new_password)
        cursor.execute("UPDATE userData SET password = %s WHERE email = %s", (new_hashed, email))
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
        cursor.execute("SELECT * FROM studentData")
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
        print(user)
        studentID = user["studentID"]
        role = user["role"]
        cursor.execute("SELECT * FROM studentData WHERE studentID = %s", (studentID,))
        user_data = cursor.fetchone()
        
        return user_data, 201

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
        cursor.execute("SELECT points FROM studentData WHERE studentID = %s", (student_id,))
        student = cursor.fetchone()
        if not student:
            return {"error": "Student not found"}, 404

        # 查询全部兑换记录（按时间降序）
        cursor.execute("""
            SELECT rewardID, timestamp
            FROM rewardData
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

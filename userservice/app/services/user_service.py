from app.models.db import get_db_connection
from app.utils.auth import hash_password, verify_password
from app.utils.code import generate_code, store_code
from app.utils.email_sender import send_email_verification
from app.utils.code import verify_code, remove_code
def register_user(data):
    required_fields = ["studentID", "email", "name", "faculty", "degree",
                       "citizenship", "isArcMember", "graduationYear", "role", "password"]
    missing = [f for f in required_fields if f not in data or data[f] in [None, ""]]
    if missing:
        return {"error": f"Missing fields: {', '.join(missing)}"}, 400

    conn = get_db_connection()
    if not conn:
        return {"error": "Database connection failed"}, 500

    try:
        cursor = conn.cursor()

        # ✅ 检查 email 是否已存在
        cursor.execute("SELECT 1 FROM demo_userData WHERE email = %s", (data['email'],))
        if cursor.fetchone():
            return {"error": "Email already exists."}, 400

        # ✅ 检查 studentID 是否已存在
        cursor.execute("SELECT 1 FROM demo_userData WHERE studentID = %s", (data['studentID'],))
        if cursor.fetchone():
            return {"error": "Student ID already exists."}, 400

        hashed = hash_password(data["password"])

        # 插入 student 数据
        cursor.execute("""
            INSERT INTO demo_studentData 
            (studentID, email, name, faculty, degree, citizenship, isArcMember, graduationYear, role)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data["studentID"], data["email"], data["name"], data["faculty"],
            data["degree"], data["citizenship"], data["isArcMember"],
            int(data["graduationYear"]), data["role"]
        ))

        # 插入用户密码数据
        cursor.execute("""
            INSERT INTO demo_userData 
            (studentID, email, password, role)
            VALUES (%s, %s, %s, %s)
        """, (
            data["studentID"], data["email"], hashed, data["role"]
        ))

        conn.commit()
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
        cursor.execute("SELECT studentID, password, role FROM demo_userData WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return {"error": "Invalid credentials"}, 401
        studentID, hashed, role = user
        if verify_password(hashed, password):
            return {"message": "Login successful", "studentID": studentID, "role": role}, 200
        return {"error": "Invalid credentials"}, 401
    finally:
        cursor.close()
        conn.close()


def check_email_exists(email):
    conn = get_db_connection()
    if not conn:
        return False
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM demo_userData WHERE email = %s", (email,))
        return cursor.fetchone() is not None
    finally:
        cursor.close()
        conn.close()

def handle_email_verification(email):
    if not check_email_exists(email):
        print("111")
        return {"error": "Email is not registered."}, 400

    code = generate_code()
    store_code(email, code)

    success = send_email_verification(email, code)
    if not success:
        return {"error": "Failed to send verification code."}, 500

    return {"message": "Verification code has been sent. Please check your email."}, 200


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
        cursor.execute("SELECT password FROM demo_userData WHERE email = %s", (email,))
        result = cursor.fetchone()
        if not result:
            return {"error": "Email not found."}, 400

        old_hashed = result[0]

        # 3. 判断新密码是否与旧密码一致（加密前比对）
        if verify_password(old_hashed, new_password):
            return {"error": "New password cannot be the same as the old password."}, 400

        # 4. 更新密码
        new_hashed = hash_password(new_password)
        cursor.execute("UPDATE demo_userData SET password = %s WHERE email = %s", (new_hashed, email))
        conn.commit()

        # 5. 清除验证码
        remove_code(email)

        return {"message": "Password has been reset successfully."}, 200

    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
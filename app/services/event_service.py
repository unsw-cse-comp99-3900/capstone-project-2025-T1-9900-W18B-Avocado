import os
import uuid
import json
from datetime import datetime
from werkzeug.utils import secure_filename
from app.db.connection import get_db_connection

# 技能字段映射：全称 → 缩写
SKILL_MAPPING = {
    "Effective Communication": "EC",
    "Leadership & Team Management": "LT",
    "Analytical & Problem-Solving Abilities": "AP",
    "Professional Networking & Relationship-Building": "PR",
    "Adaptability & Cross-Cultural Collaboration": "AC",
    "Creative & Strategic Thinking": "CT",
    "Project & Time Management": "PM",
    "Emotional Intelligence & Inclusivity": "EI",
    "Negotiation & Persuasion": "NP",
    "Self-Motivation & Initiative": "SM"
}

# 图片上传目录（确保目录存在）
UPLOAD_FOLDER = "static/uploads"
PAGE_SIZE = 10  # 每页条数

def create_event(form, files):
    """
    接收前端 form 表单 + 文件，保存图片，插入数据库
    """
    try:
        # 保存图片
        image_file = files.get("image")
        image_url = None

        if image_file:
            filename = secure_filename(image_file.filename)
            ext = os.path.splitext(filename)[-1]
            unique_filename = f"{uuid.uuid4().hex}{ext}"
            save_path = os.path.join(UPLOAD_FOLDER, unique_filename)

            # 确保上传目录存在
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)

            # 保存图片
            image_file.save(save_path)
            image_url = f"/{UPLOAD_FOLDER}/{unique_filename}"  # 或使用你完整的域名路径

        # 基础字段
        data = {
            "name": form.get("name"),
            "location": form.get("location"),
            "externalLink": form.get("externalLink"),
            "startTime": form.get("start"),
            "endTime": form.get("end"),
            "summary": form.get("summary"),
            "description": form.get("description"),
            "tag": form.get("tag"),
            "organizer": form.get("organizer"),
            "image": image_url
        }
        print(form)
        # 解析技能评分 JSON
        skill_points_raw = form.get("skillPoints", "{}")
        try:
            skill_dict = json.loads(skill_points_raw)
        except json.JSONDecodeError:
            return {"error": "Invalid JSON format for skillPoints"}, 400

        for full_name, short_key in SKILL_MAPPING.items():
            data[short_key] = skill_dict.get(full_name, 0)

        # 连接数据库并插入
        conn = get_db_connection()
        if not conn:
            return {"error": "DB connection failed"}, 500

        cursor = conn.cursor()

        sql = """
            INSERT INTO EventData (
                name, location, externalLink, startTime, endTime,
                summary, description, tag, organizer, image,
                EC, LT, AP, PR, AC, CT, PM, EI, NP, SM
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            data.get("name"), data.get("location"), data.get("externalLink"),
            data.get("startTime"), data.get("endTime"), data.get("summary"),
            data.get("description"), data.get("tag"), data.get("organizer"),
            data.get("image"),
            data.get("EC"), data.get("LT"), data.get("AP"), data.get("PR"),
            data.get("AC"), data.get("CT"), data.get("PM"), data.get("EI"),
            data.get("NP"), data.get("SM")
        )

        cursor.execute(sql, values)
        conn.commit()
        return {"message": "Event created successfully"}, 201

    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()


def get_event_list(filter_type, page, search=None, tag=None):
    conn = get_db_connection()
    if not conn:
        return {"error": "DB connection failed"}

    try:
        cursor = conn.cursor(dictionary=True)
        offset = (page - 1) * PAGE_SIZE
        now = datetime.now()

        base_query = "SELECT * FROM EventData"
        count_query = "SELECT COUNT(*) as total FROM EventData"
        where_clauses = []
        values = []
        count_values = []

        # 🕐 时间过滤
        if filter_type == "current":
            where_clauses.append("startTime <= %s AND endTime >= %s")
            values += [now, now]
            count_values += [now, now]
        elif filter_type == "previous":
            where_clauses.append("endTime < %s")
            values.append(now)
            count_values.append(now)
        elif filter_type == "upcoming":
            where_clauses.append("startTime > %s")
            values.append(now)
            count_values.append(now)

        # 🔍 名称模糊搜索
        if search:
            where_clauses.append("name LIKE %s")
            values.append(f"%{search}%")
            count_values.append(f"%{search}%")

        # 🏷️ 标签过滤
        if tag:
            where_clauses.append("tag LIKE %s")
            values.append(f"%{tag}%")
            count_values.append(f"%{tag}%")

        # 拼接 WHERE 语句
        where_clause = ""
        if where_clauses:
            where_clause = "WHERE " + " AND ".join(where_clauses)

        # 1️⃣ 查询总数
        count_sql = f"{count_query} {where_clause}"
        cursor.execute(count_sql, count_values)
        total_count = cursor.fetchone()['total']
        total_pages = (total_count + PAGE_SIZE - 1) // PAGE_SIZE

        # 2️⃣ 查询分页数据
        sql = f"{base_query} {where_clause} ORDER BY startTime DESC LIMIT %s OFFSET %s"
        values += [PAGE_SIZE, offset]
        cursor.execute(sql, values)
        rows = cursor.fetchall()

        # 时间格式化
        for row in rows:
            if isinstance(row.get('startTime'), datetime):
                row['startTime'] = row['startTime'].strftime("%Y-%m-%d %H:%M:%S")
            if isinstance(row.get('endTime'), datetime):
                row['endTime'] = row['endTime'].strftime("%Y-%m-%d %H:%M:%S")

        return {
            "page": page,
            "pageSize": PAGE_SIZE,
            "totalCount": total_count,
            "totalPages": total_pages,
            "events": rows
        }

    except Exception as e:
        return {"error": str(e)}
    finally:
        cursor.close()
        conn.close()

def update_event(event_id, form):
    if not event_id:
        return {"error": "Missing eventID"}, 400

    try:
        # 提取常规字段
        data = {
            "name": form.get("name"),
            "location": form.get("location"),
            "externalLink": form.get("externalLink"),
            "startTime": form.get("start"),
            "endTime": form.get("end"),
            "summary": form.get("summary"),
            "description": form.get("description"),
            "tag": form.get("tag"),
            "organizer": form.get("organizer")
        }

        # 提取 skillPoints（JSON 字符串）
        skill_data = {}
        skill_raw = form.get("skillPoints")
        if skill_raw:
            try:
                skill_dict = json.loads(skill_raw)
                for full, short in SKILL_MAPPING.items():
                    skill_data[short] = skill_dict.get(full, 0)
            except json.JSONDecodeError:
                return {"error": "Invalid JSON format in skillPoints"}, 400

        # 合并字段，排除空值
        update_fields = {**data, **skill_data}
        update_fields = {k: v for k, v in update_fields.items() if v is not None}

        if not update_fields:
            return {"error": "No fields to update"}, 400

        # 构造 SQL
        set_clause = ", ".join(f"{key} = %s" for key in update_fields.keys())
        values = list(update_fields.values())

        sql = f"UPDATE EventData SET {set_clause} WHERE eventID = %s"
        values.append(event_id)

        # 执行数据库操作
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(sql, values)
        conn.commit()

        return {"message": "Event updated successfully"}, 200

    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()



def delete_event(event_id):
    if not event_id:
        return {"error": "Missing eventID"}, 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 检查是否存在
        cursor.execute("SELECT * FROM EventData WHERE eventID = %s", (event_id,))
        if not cursor.fetchone():
            return {"error": "Event not found"}, 404

        # 执行删除
        cursor.execute("DELETE FROM EventData WHERE eventID = %s", (event_id,))
        conn.commit()

        return {"message": "Event deleted successfully"}, 200

    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()


def register_event(data):
    event_id = data.get("eventID")
    student_id = data.get("studentID")

    if not event_id or not student_id:
        return {"error": "Missing eventID or studentID"}, 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 检查是否已报名（防重复）
        cursor.execute("""
            SELECT * FROM AttendanceData WHERE eventID = %s AND studentID = %s
        """, (event_id, student_id))
        if cursor.fetchone():
            return {"error": "You have already registered for this event."}, 409

        # 插入新的 ticket
        cursor.execute("""
            INSERT INTO AttendanceData (eventID, studentID, checkIn)
            VALUES (%s, %s, %s)
        """, (event_id, student_id, 0))

        conn.commit()
        return {"message": "Registration successful"}, 201

    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()
import os
import uuid
import json
from datetime import datetime
from werkzeug.utils import secure_filename
from app.db.connection import get_db_connection
import requests
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
            INSERT INTO eventdata (
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


def get_event_list(filter_type, page, search=None, tag=None, category=None):
    conn = get_db_connection()
    if not conn:
        return {"error": "DB connection failed"}

    try:
        cursor = conn.cursor(dictionary=True)
        offset = (page - 1) * PAGE_SIZE
        now = datetime.now()

        base_query = "SELECT * FROM eventdata"
        count_query = "SELECT COUNT(*) as total FROM eventdata"
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

        # ✅ category 小分字段过滤（如 EC、LT 等）
        if category and category in ["EC", "LT", "AP", "PR", "AC", "CT", "PM", "EI", "NP", "SM"]:
            where_clauses.append(f"{category} > 0")

        # 拼接 WHERE 子句
        where_clause = ""
        if where_clauses:
            where_clause = "WHERE " + " AND ".join(where_clauses)

        # 1️⃣ 查询总条数
        count_sql = f"{count_query} {where_clause}"
        cursor.execute(count_sql, count_values)
        total_count = cursor.fetchone()['total']
        total_pages = (total_count + PAGE_SIZE - 1) // PAGE_SIZE

        # 2️⃣ 查询分页数据
        sql = f"{base_query} {where_clause} ORDER BY startTime DESC LIMIT %s OFFSET %s"
        values += [PAGE_SIZE, offset]
        cursor.execute(sql, values)
        rows = cursor.fetchall()

        # 格式化时间
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

def update_event(event_id, form, image_file):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 获取旧图路径
        cursor.execute("SELECT image FROM eventdata WHERE eventID = %s", (event_id,))
        result = cursor.fetchone()
        if not result:
            return {"error": "Event not found"}, 404
        old_image_path = result[0]

        # 保留字段更新逻辑
        allowed_fields = [
            "name", "location", "externalLink", "startTime", "endTime",
            "summary", "description", "tag", "organizer", "image",
            "EC", "LT", "AP", "PR", "AC", "CT", "PM", "EI", "NP", "SM"
        ]
        update_data = {}

        for field in allowed_fields:
            if field != "image" and field in form:
                update_data[field] = form.get(field)

        # ✅ 图片处理逻辑（使用 create_event 中的一致策略）
        new_image_url = old_image_path

        if image_file and image_file.filename:
            # 生成唯一文件名 + 保存
            filename = secure_filename(image_file.filename)
            ext = os.path.splitext(filename)[-1]
            unique_filename = f"{uuid.uuid4().hex}{ext}"
            save_path = os.path.join(UPLOAD_FOLDER, unique_filename)

            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            image_file.save(save_path)

            new_image_url = f"/{UPLOAD_FOLDER}/{unique_filename}"

            # 删除旧图（如果有）
            if old_image_path:
                old_abs_path = os.path.join(os.getcwd(), old_image_path.lstrip("/"))
                if os.path.exists(old_abs_path):
                    try:
                        os.remove(old_abs_path)
                        print(f"🗑️ 已删除旧图片: {old_abs_path}")
                    except Exception as e:
                        print(f"⚠️ 删除旧图片失败: {e}")

        elif not image_file:
            # 没上传图 → 判断是否有老图，有就删除
            if old_image_path:
                old_abs_path = os.path.join(os.getcwd(), old_image_path.lstrip("/"))
                if os.path.exists(old_abs_path):
                    try:
                        os.remove(old_abs_path)
                        print(f"🗑️ 已删除旧图片: {old_abs_path}")
                    except Exception as e:
                        print(f"⚠️ 删除旧图片失败: {e}")
                new_image_url = None

        update_data["image"] = new_image_url

        if not update_data:
            return {"error": "No fields to update"}, 400

        # 拼接更新 SQL
        set_clause = ", ".join(f"{k} = %s" for k in update_data)
        values = list(update_data.values()) + [event_id]

        sql = f"UPDATE eventdata SET {set_clause} WHERE eventID = %s"
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

        # 查询图片路径（如：static/uploads/xxx.jpg）
        cursor.execute("SELECT image FROM eventdata WHERE eventID = %s", (event_id,))
        result = cursor.fetchone()
        if not result:
            return {"error": "Event not found"}, 404

        image_path = result[0]  # e.g. static/uploads/xxx.jpg

        # 删除数据库记录
        cursor.execute("DELETE FROM eventdata WHERE eventID = %s", (event_id,))
        conn.commit()
        if image_path is not None:
            image_path = image_path.lstrip("/")
        # 删除本地图片
        if image_path and isinstance(image_path, str) and image_path.strip():
            if image_path.startswith("static/uploads"):  # ✅ 确保是我们的上传目录
                relative_path = image_path.replace("/", os.sep)  # 转换为操作系统路径格式
                file_path = os.path.join(os.getcwd(), relative_path)  # 拼接为绝对路径

                if os.path.isfile(file_path):
                    try:
                        os.remove(file_path)
                        print(f"🗑️ 已删除图片: {file_path}")
                    except Exception as e:
                        print(f"⚠️ 图片删除失败: {e}")
                else:
                    print(f"⚠️ 文件不存在: {file_path}")
            else:
                print(f"🚫 路径非法，跳过删除：{image_path}")

        return {"message": "Event deleted successfully"}, 200

    except Exception as e:
        return {"error": str(e)}, 500

    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

def delete_selected_events(event_ids):
    if not event_ids or not isinstance(event_ids, list):
        return {"error": "Invalid eventIDs"}, 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 查询所有对应的图片路径
        format_strings = ','.join(['%s'] * len(event_ids))
        cursor.execute(
            f"SELECT eventID, image FROM eventdata WHERE eventID IN ({format_strings})",
            tuple(event_ids)
        )
        results = cursor.fetchall()

        # 删除数据库记录
        cursor.execute(
            f"DELETE FROM eventdata WHERE eventID IN ({format_strings})",
            tuple(event_ids)
        )
        conn.commit()

        # 删除每个 event 的图片（如果存在）
        for row in results:
            event_id, image_path = row
            if image_path is not None:
                image_path = image_path.lstrip("/")

            if image_path and isinstance(image_path, str) and image_path.strip():
                if image_path.startswith("static/uploads"):
                    relative_path = image_path.replace("/", os.sep)
                    file_path = os.path.join(os.getcwd(), relative_path)

                    if os.path.isfile(file_path):
                        try:
                            os.remove(file_path)
                            print(f"🗑️ 已删除图片: {file_path}")
                        except Exception as e:
                            print(f"⚠️ 图片删除失败（{event_id}）: {e}")
                    else:
                        print(f"⚠️ 文件不存在: {file_path}")
                else:
                    print(f"🚫 非法路径，跳过删除（{event_id}）: {image_path}")

        return {"message": f"Deleted {len(results)} events successfully."}, 200

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
            SELECT * FROM attendancedata WHERE eventID = %s AND studentID = %s
        """, (event_id, student_id))
        if cursor.fetchone():
            return {"error": "You have already registered for this event."}, 409

        # 插入新的 ticket
        cursor.execute("""
            INSERT INTO attendancedata (eventID, studentID, checkIn)
            VALUES (%s, %s, %s)
        """, (event_id, student_id, 0))

        conn.commit()
        return {"message": "Registration successful"}, 201

    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()


def get_student_events(student_id, page, filter_type):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # 获取该学生报名的所有 eventID 和 checkIn
        cursor.execute(
            "SELECT eventID, checkIn FROM attendancedata WHERE studentID = %s",
            (student_id,)
        )
        records = cursor.fetchall()
        if not records:
            return {
                "page": page,
                "pageSize": PAGE_SIZE,
                "totalCount": 0,
                "totalPages": 0,
                "events": []
            }, 200

        event_checkin_map = {r["eventID"]: r["checkIn"] for r in records}
        all_event_ids = list(event_checkin_map.keys())

        if not all_event_ids:
            return {
                "page": page,
                "pageSize": PAGE_SIZE,
                "totalCount": 0,
                "totalPages": 0,
                "events": []
            }, 200

        format_strings = ','.join(['%s'] * len(all_event_ids))

        # 时间过滤
        time_filter = ""
        now = datetime.utcnow()
        if filter_type == "current":
            time_filter = "AND startTime <= %s AND endTime >= %s"
            filter_values = [now, now]
        elif filter_type == "previous":
            time_filter = "AND endTime < %s"
            filter_values = [now]
        elif filter_type == "upcoming":
            time_filter = "AND startTime > %s"
            filter_values = [now]
        else:
            filter_values = []

        # 查询总数
        count_sql = f"""
            SELECT COUNT(*) as total FROM eventdata 
            WHERE eventID IN ({format_strings}) {time_filter}
        """
        cursor.execute(count_sql, all_event_ids + filter_values)
        total_count = cursor.fetchone()['total']
        total_pages = (total_count + PAGE_SIZE - 1) // PAGE_SIZE
        offset = (page - 1) * PAGE_SIZE

        # 查询分页数据
        query_sql = f"""
            SELECT * FROM eventdata
            WHERE eventID IN ({format_strings}) {time_filter}
            ORDER BY startTime DESC
            LIMIT %s OFFSET %s
        """
        cursor.execute(query_sql, all_event_ids + filter_values + [PAGE_SIZE, offset])
        event_rows = cursor.fetchall()
        # 构造返回值，并统一时间格式
        for ev in event_rows:
            ev["checkIn"] = event_checkin_map.get(str(ev["eventID"]), 0)
            if isinstance(ev.get('startTime'), datetime):
                ev['startTime'] = ev['startTime'].strftime("%Y-%m-%d %H:%M:%S")
            if isinstance(ev.get('endTime'), datetime):
                ev['endTime'] = ev['endTime'].strftime("%Y-%m-%d %H:%M:%S")

        return {
            "page": page,
            "pageSize": PAGE_SIZE,
            "totalCount": total_count,
            "totalPages": total_pages,
            "events": event_rows  # 全字段返回（含 checkIn）
        }, 200

    except Exception as e:
        return {"error": str(e)}, 500

    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()


def get_previous_events(student_id, page, filter_type):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # 获取 eventID、checkIn、ticketID
        cursor.execute(
            "SELECT eventID, checkIn, ticketID FROM attendancedata WHERE studentID = %s",
            (student_id,)
        )
        records = cursor.fetchall()
        if not records:
            return {
                "events": [],
                "page": page,
                "pageSize": PAGE_SIZE,
                "totalCount": 0,
                "totalPages": 0
            }, 200

        event_checkin_map = {
            r["eventID"]: {"checkIn": r["checkIn"], "ticketID": r["ticketID"]}
            for r in records
        }
        all_event_ids = list(event_checkin_map.keys())
        format_strings = ','.join(['%s'] * len(all_event_ids))

        now = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        if filter_type == "current":
            time_filter = "AND startTime <= %s AND endTime >= %s"
            filter_values = [now, now]
        elif filter_type == "previous":
            time_filter = "AND endTime < %s"
            filter_values = [now]
        elif filter_type == "upcoming":
            time_filter = "AND startTime > %s"
            filter_values = [now]
        else:
            time_filter = ""
            filter_values = []

        count_sql = f"""
            SELECT COUNT(*) as total FROM eventdata 
            WHERE eventID IN ({format_strings}) {time_filter}
        """
        cursor.execute(count_sql, all_event_ids + filter_values)
        total_count = cursor.fetchone()['total']
        total_pages = (total_count + PAGE_SIZE - 1) // PAGE_SIZE
        offset = (page - 1) * PAGE_SIZE

        query_sql = f"""
            SELECT * FROM eventdata
            WHERE eventID IN ({format_strings}) {time_filter}
            ORDER BY startTime DESC
            LIMIT %s OFFSET %s
        """
        cursor.execute(query_sql, all_event_ids + filter_values + [PAGE_SIZE, offset])
        event_rows = cursor.fetchall()

        enriched_events = []
        for ev in event_rows:
            event_id = ev["eventID"]
            info = event_checkin_map.get(str(event_id), {})
            enriched_events.append({
                "eventID": event_id,
                "name": ev["name"],
                "location": ev["location"],
                "startTime": ev["startTime"],
                "endTime": ev["endTime"],
                "checkIn": info.get("checkIn", 0),
                "ticketID": info.get("ticketID"),
                "tag": ev.get("tag")
            })

        return {
            "events": enriched_events,
            "page": page,
            "pageSize": PAGE_SIZE,
            "totalCount": total_count,
            "totalPages": total_pages
        }, 200

    except Exception as e:
        return {"error": str(e)}, 500

    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

def checkin_event(student_id, event_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # 1. 检查是否存在报名记录，且未签到
        cursor.execute(
            "SELECT * FROM attendancedata WHERE studentID = %s AND eventID = %s",
            (student_id, event_id)
        )
        record = cursor.fetchone()
        if not record:
            return {"error": "No registration found for this event"}, 404
        elif record["checkIn"] == 1:
            return {"error": "You have already checked in"}, 400

        # 2. 更新签到状态
        cursor.execute(
            "UPDATE attendancedata SET checkIn = 1 WHERE studentID = %s AND eventID = %s",
            (student_id, event_id)
        )

        # 3. 查询此 eventID 的 10 项软技能得分
        skill_fields = ["AC", "AP", "CT", "EC", "EI", "LT", "NP", "PM", "PR", "SM"]
        cursor.execute(
            f"SELECT {', '.join(skill_fields)} FROM eventdata WHERE eventID = %s",
            (event_id,)
        )
        event_skills = cursor.fetchone()
        if not event_skills:
            return {"error": "Event not found in eventdata"}, 404

        total_reward = sum(event_skills.get(skill, 0) or 0 for skill in skill_fields)

        # 4. 更新 studentdata 的积分
        cursor.execute(
            "UPDATE studentdata SET points = points + %s WHERE studentID = %s",
            (total_reward, student_id)
        )

        conn.commit()
        return {
            "message": "Check-in successful",
            "points_earned": total_reward
        }, 200

    except Exception as e:
        return {"error": str(e)}, 500

    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()



REWARD_COST = {
    1: 20,
    2: 50,
    3: 100
}

def redeem_reward(student_id, reward_id):
    if reward_id not in REWARD_COST:
        return {"error": "Invalid rewardID"}, 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # 获取当前学生积分
        cursor.execute("SELECT points FROM studentdata WHERE studentID = %s", (student_id,))
        row = cursor.fetchone()
        if not row:
            return {"error": "Student not found"}, 404
        current_points = row["points"]
        cost = REWARD_COST[reward_id]

        if current_points < cost:
            return {"error": "Not enough points to redeem this reward"}, 400

        # 记录兑换记录
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("""
            INSERT INTO rewarddata (studentID, rewardID, timestamp)
            VALUES (%s, %s, %s)
        """, (student_id, reward_id, now))

        # 更新学生积分
        cursor.execute("""
            UPDATE studentdata SET points = points - %s WHERE studentID = %s
        """, (cost, student_id))

        conn.commit()
        return {"message": "Reward redeemed successfully"}, 200

    except Exception as e:
        return {"error": str(e)}, 500

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()



def attend_event(event_id, student_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # ✅ 获取活动时间范围
        cursor.execute(
            "SELECT startTime, endTime FROM eventdata WHERE eventID = %s",
            (event_id,)
        )
        event = cursor.fetchone()
        if not event:
            return {"error": "Event not found."}, 404

        start_time, end_time = event
        now = datetime.utcnow()

        # ✅ 只判断是否已结束
        if now > end_time:
            return {"error": "This event has already ended."}, 400

        # ✅ 判断是否已报名
        cursor.execute(
            "SELECT 1 FROM attendancedata WHERE studentID = %s AND eventID = %s",
            (student_id, event_id)
        )
        if cursor.fetchone():
            return {"error": "You have already registered for this event."}, 400

        # ✅ 插入新报名记录
        cursor.execute(
            "INSERT INTO attendancedata (studentID, eventID, checkIn) VALUES (%s, %s, 0)",
            (student_id, event_id)
        )
        ticket_id = cursor.lastrowid
        conn.commit()

        return {
            "message": "Event registration successful.",
            "ticketId": ticket_id
        }, 201

    except Exception as e:
        print("❌ attend_event error:", repr(e))
        return {"error": f"Server error: {str(e)}"}, 500

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()



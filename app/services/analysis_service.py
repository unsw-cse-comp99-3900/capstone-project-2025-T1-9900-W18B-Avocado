from app.models.db import get_db_connection
from app.config import *
import google.generativeai as genai
import requests

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

def get_skill_summary(student_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Step 1: 获取该学生所有报名的 eventID
        cursor.execute("SELECT eventID FROM attendancedata WHERE studentID = %s", (student_id,))
        records = cursor.fetchall()
        event_ids = [r["eventID"] for r in records]

        if not event_ids:
            return {
                "skillScores": {k: 0 for k in SKILL_MAPPING},
                "coachAnalysis": "No attended events yet."
            }, 200

        # Step 2: 初始化分数容器
        raw_scores = {k: 0 for k in SKILL_MAPPING}  # 英文描述为 key

        # Step 3: 遍历每个 eventID，累加对应分数
        for event_id in event_ids:
            cursor.execute("SELECT * FROM eventdata WHERE eventID = %s", (event_id,))
            event = cursor.fetchone()
            if not event:
                continue
            for full_name, short_key in SKILL_MAPPING.items():
                raw_scores[full_name] += int(event.get(short_key, 0))

        # Step 4: 将分数归一化为 0~10
        max_score = max(raw_scores.values()) if raw_scores else 1
        skill_scores = {
            k: round((v / max_score) * 10, 2) if max_score > 0 else 0
            for k, v in raw_scores.items()
        }

        # Step 5: Coach 分析（你可以自定义逻辑）
        coach_analysis = get_gemini_coach_advice(skill_scores)

        return {
            "skillScores": skill_scores,
            "coachAnalysis": coach_analysis
        }, 200

    except Exception as e:
        return {"error": str(e)}, 500

    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()


def get_gemini_coach_advice(skill_scores):
    try:
        # 构造提示文本
        skill_lines = [f"- {skill}: {score}" for skill, score in skill_scores.items()]
        prompt = (
                "Based on the following soft skill scores (out of 10), give personalized career advice:\n"
                + "\n".join(skill_lines) +
                "\nRespond in one short paragraph, keep it concise and under 50 words."
        )

        # Gemini API 请求体
        data = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }

        # 请求地址（模型版本你可以换为 gemini-1.0-pro, gemini-2.0-pro, gemini-2.0-flash）
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GOOGLE_API_KEY}"

        response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            json=data
        )

        if response.status_code == 200:
            result = response.json()
            return result["candidates"][0]["content"]["parts"][0]["text"]
        else:
            print(f"❌ Gemini API failed with {response.status_code}: {response.text}")
            return "You're doing great! Keep attending more events to strengthen your skills."

    except Exception as e:
        print(f"❌ Exception during Gemini API call: {e}")
        return "You're doing great! Keep attending more events to strengthen your skills."
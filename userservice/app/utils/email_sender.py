import smtplib
from email.mime.text import MIMEText
from email.header import Header
from app.config import *

def send_email_verification(recipient, code):
    subject = "【What's On!】你的验证码"
    body = f"你好！你的验证码是：{code}，有效期5分钟。请勿泄露。"

    msg = MIMEText(body, "plain", "utf-8")
    msg["From"] = Header(MAIL_USERNAME)
    msg["To"] = Header(recipient)
    msg["Subject"] = Header(subject)

    try:
        # ✅ 使用 SMTP_SSL（注意！不是 starttls）
        server = smtplib.SMTP_SSL(MAIL_SERVER, MAIL_PORT)
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_SENDER, [recipient], msg.as_string())
        server.quit()
        print(f"📨 验证码已发送到 {recipient}")
        return True
    except Exception as e:
        print(f"❌ 邮件发送失败: {e}")
        return False



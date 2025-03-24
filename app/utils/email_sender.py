import smtplib
from email.mime.text import MIMEText
from email.header import Header
from app.config import *

def send_email_verification(recipient, code):
    subject = "【What's On!】你的验证码"
    body = f"你好！你的验证码是：{code}，有效期5分钟。请勿泄露。"
    msg = MIMEText(body, "plain", "utf-8")
    msg["From"] = Header("What's On!", "utf-8")
    msg["To"] = Header(recipient, "utf-8")
    msg["Subject"] = Header(subject, "utf-8")

    try:
        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        if MAIL_USE_TLS:
            server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_SENDER, [recipient], msg.as_string())
        server.quit()
        print(f"📨 验证码已发送到 {recipient}")
        return True
    except Exception as e:
        print(f"❌ 邮件发送失败: {e}")
        return False



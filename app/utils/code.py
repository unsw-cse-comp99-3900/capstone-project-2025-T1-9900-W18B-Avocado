from datetime import datetime, timedelta
import random

# In-memory verification code store
verification_codes = {}

# Generate a 6-digit random code
def generate_code():
    return str(random.randint(100000, 999999))

# Store code with 5-minute expiration
def store_code(email, code):
    # 清除旧验证码，确保唯一性
    verification_codes.pop(email, None)

    expire_at = datetime.utcnow() + timedelta(minutes=5)
    verification_codes[email] = {
        "code": code,
        "expire_at": expire_at
    }
    print(f"[验证码已更新] {email}: {verification_codes[email]}")

# Get the full code record (optional helper)
def get_code_record(email):
    return verification_codes.get(email)

# Verify if the code matches and is not expired
def verify_code(email, input_code):
    record = verification_codes.get(email)
    if not record:
        return False
    return record["code"] == input_code and datetime.utcnow() < record["expire_at"]

# Remove used/expired code
def remove_code(email):
    verification_codes.pop(email, None)

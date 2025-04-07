from datetime import datetime, timedelta
import random
from app.utils.redis_client import redis_client
# In-memory verification code store
verification_codes = {}


# Generate a 6-digit random code
def generate_code():
    return str(random.randint(100000, 999999))

# Store code in Redis with 5-minute expiration
def store_code(email, code):
    key = f"verify:{email}"
    redis_client.setex(name=key, time=timedelta(minutes=5), value=code)
    print(f"[验证码已写入 Redis] {key} = {code}")

# Get the stored code from Redis
def get_code_record(email):
    code = redis_client.get(f"verify:{email}")
    return {"code": code} if code else None

# Verify if code matches
def verify_code(email, input_code):
    stored_code = redis_client.get(f"verify:{email}")
    return stored_code == input_code

# Remove code after used or manually
def remove_code(email):
    redis_client.delete(f"verify:{email}")

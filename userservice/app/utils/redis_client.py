import redis

redis_client = redis.StrictRedis(
    host='redis',  # 或 Docker 网络中的 Redis 容器名
    port=6379,
    db=0,
    decode_responses=True  # 返回 str 而不是 bytes
)
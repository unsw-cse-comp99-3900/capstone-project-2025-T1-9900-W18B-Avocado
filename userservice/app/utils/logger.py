import logging
import sys
import os
from pythonjsonlogger import jsonlogger

LOG_DIR = "./logs"
os.makedirs(LOG_DIR, exist_ok=True)

def get_logger(service_name="user-service"):
    logger = logging.getLogger(service_name)
    logger.setLevel(logging.INFO)

    formatter = jsonlogger.JsonFormatter('%(asctime)s %(levelname)s %(service)s %(message)s')

    # 写入日志文件
    log_file_path = os.path.join(LOG_DIR, f"{service_name}.log")
    file_handler = logging.FileHandler(log_file_path)
    file_handler.setFormatter(formatter)

    # 同时打印到控制台
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(formatter)

    # 避免重复添加
    if not logger.handlers:
        logger.addHandler(file_handler)
        logger.addHandler(stream_handler)

    return logging.LoggerAdapter(logger, {"service": service_name})

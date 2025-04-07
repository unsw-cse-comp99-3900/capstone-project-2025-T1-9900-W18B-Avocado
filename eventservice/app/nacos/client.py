from nacos import NacosClient
import threading
import socket
import time
from app.config import *

def get_host_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

host_ip = get_host_ip()
port = SERVICE_PORT  # 从 config 中读 eventservice/userservice 的端口

nacos_client = NacosClient(NACOS_SERVER, namespace=NACOS_NAMESPACE)

def register_service():
    for attempt in range(10):
        try:
            print(f"🚀 第 {attempt + 1} 次尝试注册到 Nacos：{host_ip}:{port}")
            nacos_client.add_naming_instance(NACOS_SERVICE_NAME, host_ip, port)
            print(f"✅ 服务已注册到 Nacos：{host_ip}:{port}")
            return
        except Exception as e:
            print(f"❌ 注册失败：{e}，3秒后重试")
            time.sleep(3)
    print("🛑 已达最大重试次数，停止注册")

def start_nacos_registration():
    t = threading.Thread(target=register_service)
    t.daemon = True
    t.start()

def get_mysql_config():
    try:
        config_str = nacos_client.get_config(NACOS_DATA_ID, NACOS_GROUP)
        return eval(config_str) if config_str else {}
    except Exception as e:
        print(f"⚠️ 获取 MySQL 配置失败: {e}")
        return {}

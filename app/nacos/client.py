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
port = SERVICE_PORT  # 固定端口

nacos_client = NacosClient(NACOS_SERVER, namespace=NACOS_NAMESPACE)


def start_nacos_registration():
    def register_and_heartbeat():
        for attempt in range(10):
            try:
                nacos_client.add_naming_instance(NACOS_SERVICE_NAME, host_ip, port, ephemeral=True)
                print(f"✅ 注册成功: {host_ip}:{port}")
                break
            except Exception as e:
                print(f"❌ 注册失败: {e}")
                time.sleep(3)

        # 💓 开始发心跳
        while True:
            try:
                nacos_client.send_heartbeat(NACOS_SERVICE_NAME, host_ip, port)
                print("💓 心跳发送成功")
            except Exception as e:
                print(f"❌ 心跳失败: {e}")
            time.sleep(5)

    threading.Thread(target=register_and_heartbeat, daemon=True).start()

def get_mysql_config():
    try:
        config_str = nacos_client.get_config(NACOS_DATA_ID, NACOS_GROUP)
        return eval(config_str) if config_str else {}
    except Exception as e:
        print(f"⚠️ 获取 MySQL 配置失败: {e}")
        return {}


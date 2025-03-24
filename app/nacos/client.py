from nacos import NacosClient
import threading
import socket
from app.config import *

def get_host_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
    s.close()
    return ip

host_ip = get_host_ip()
port = 5000

nacos_client = NacosClient(NACOS_SERVER, namespace=NACOS_NAMESPACE)

def register_service():
    nacos_client.add_naming_instance(NACOS_SERVICE_NAME, host_ip, port)
    print(f"✅ 服务已注册到 Nacos：{host_ip}:{port}")

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

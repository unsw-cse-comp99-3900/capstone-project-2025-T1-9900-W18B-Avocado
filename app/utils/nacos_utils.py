from app.nacos.client import nacos_client


def select_one_healthy_instance(service_name):
    """
    获取某个服务的一个健康实例。
    """
    try:
        service_info = nacos_client.list_naming_instance(service_name)
        instances = service_info.get("hosts", [])
        healthy_instances = [inst for inst in instances if inst.get("healthy")]
        if not healthy_instances:
            raise Exception(f"No healthy instance found for service '{service_name}'")
        return healthy_instances[0]
    except Exception as e:
        print(f"❌ Error selecting healthy instance for {service_name}:", e)
        raise


def get_service_url(service_name):
    """
    获取某个服务的 URL，例如：http://ip:port
    """
    instance = select_one_healthy_instance(service_name)
    return f"http://{instance['ip']}:{instance['port']}"
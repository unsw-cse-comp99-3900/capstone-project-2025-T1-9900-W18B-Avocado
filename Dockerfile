# 使用 Python 官方镜像
FROM python:3.11

# 设置工作目录
WORKDIR /app

# 复制项目文件到容器
COPY . /app

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 设置环境变量，防止 Python 缓存影响容器
ENV PYTHONUNBUFFERED=1

# 运行 Flask
CMD ["python", "app.py"]

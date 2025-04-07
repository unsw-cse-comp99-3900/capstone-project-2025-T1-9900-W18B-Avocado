# app/db/connection.py
import mysql.connector
from app.nacos.client import get_mysql_config

mysql_config = get_mysql_config()

DB_CONFIG = {
    "host": mysql_config.get("host", "localhost"),
    "user": mysql_config.get("user", "root"),
    "password": mysql_config.get("password", "123456"),
    "database": mysql_config.get("database", "demo_db")
}

def get_db_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except mysql.connector.Error as e:
        print("⚠️ 数据库连接失败:", e)
        return None

import mysql.connector
from mysql.connector import Error

# 連接 MySQL/MariaDB 資料庫
connection = mysql.connector.connect(
    host='localhost',          # 主機名稱
    database='db_project', # 資料庫名稱
    user='root',        # 帳號
    password='q123')  # 密碼
#print(connection)
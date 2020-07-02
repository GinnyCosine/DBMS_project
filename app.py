from flask import Flask,render_template,request,jsonify
import mysql.connector
from mysql.connector import Error
import json

connection = mysql.connector.connect(
    host='localhost',           # 主機名稱
    database='db_project',      # 資料庫名稱
    user='root',                # 帳號
    password='q123')            # 密碼

# create an app instance
app = Flask(__name__)

# at the end point / 根目錄
@app.route("/")
def index():
    return render_template('index.html')

# request pwd of user
@app.route("/user", methods = ['GET'])
def get_user_pwd():
    print(123)
    return jsonify({'pwd':'123'})


if __name__ == "__main__":        # on running python app.py
    app.run()                     # run the flask app
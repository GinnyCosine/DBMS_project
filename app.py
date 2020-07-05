from flask import Flask,render_template,request,jsonify
import mysql.connector
from mysql.connector import Error
import json

connection = mysql.connector.connect(
    host='localhost',           # 主機名稱
    database='db_project',      # 資料庫名稱
    user='root',                # 帳號
    password='q123'             # 密碼
)

mycursor = connection.cursor()

# create an app instance
app = Flask(__name__)

user = 'none'

# at the end point / 根目錄
@app.route("/")
def index():
    return render_template('index.html')

@app.route("/publicTransportation")
def publicTran():
    return render_template('publicTran.html')

@app.route("/myRoute")
def myRoute():
    return render_template('myRoute.html')

# request pwd of user
@app.route("/login/<user>", methods = ['GET'])
def get_user_pwd(user):
    mycursor.execute('SELECT pwd FROM UserInfo WHERE user = "' + user + '"')
    result = mycursor.fetchall()
    if len(result) == 0:
        return jsonify({'pwd':'###'})   # user not exists
    else:
        return jsonify({'pwd': result[0][0]})

# create user
@app.route("/create_user", methods = ['POST'])
def create_user():
    user = request.json['user']
    mycursor.execute('SELECT pwd FROM UserInfo WHERE user = "' + user + '"')
    result = mycursor.fetchall()
    if len(result) != 0:
        return jsonify({'status':'fail'})   # user exists
    pwd = request.json['pwd']
    mycursor.execute('INSERT INTO UserInfo (user, pwd) VALUES ("' + user + '","'+ pwd +'")')
    connection.commit()
    return jsonify({'status':'ok'})   # user exists

# get station options from city
@app.route("/stationsFromCity/<trType>", methods = ['POST'])
def stationsFromCity(trType):
    city = request.json['city']
    mycursor.execute('SELECT StationName FROM ' + trType + 'stations WHERE City = "' + city + '"')
    result = mycursor.fetchall()
    stations = []
    for st in result:
        stations.append({'stationName':st[0]})
    return jsonify({'stations':stations})

# get station options from keyin
@app.route("/stationsFromKeyin/<trType>", methods = ['POST'])
def stationsFromKeyin(trType):
    keyin = request.json['keyin']
    mycursor.execute('SELECT StationName FROM ' + trType + 'stations WHERE StationName LIKE "%' + keyin + '%"')
    result = mycursor.fetchall()
    stations = []
    for st in result:
        stations.append({'stationName':st[0]})
    return jsonify({'stations':stations})

#　寫這個
@app.route("/RailwayResult/<trType>", methods = ['POST'])
def RailwayResult(trType):
    return jsonify({'status':'OK'})

if __name__ == "__main__":        # on running python app.py
    app.run()                     # run the flask app
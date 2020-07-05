from flask import Flask,render_template,request,jsonify
import mysql.connector
from mysql.connector import Error
import json
from datetime import datetime

# database connection
connection = mysql.connector.connect(
    host='localhost',           # 主機名稱
    database='db_project',      # 資料庫名稱
    user='root',                # 帳號
    password='q123'             # 密碼
)
mycursor = connection.cursor()

# Initial set
Week = ['Mon','Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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

#　Railway query
@app.route("/RailwayResult/<trType>", methods = ['POST'])
def RailwayResult(trType):
    from_station = request.json['from_station']
    to_station = request.json['to_station']
    m = request.json['min']
    h = request.json['hour']
    date = request.json['date']
    month = request.json['month']
    mycursor.execute('SELECT StationID FROM ' + trType + 'stations WHERE StationName = "' + from_station + '"')
    result = mycursor.fetchall()
    if (len(result) == 0):
        return jsonify({'status':1})
    from_stationID = result[0][0]
    mycursor.execute('SELECT StationID FROM ' + trType + 'stations WHERE StationName = "' + to_station + '"')
    result = mycursor.fetchall()
    if (len(result) == 0):
        return jsonify({'status':1})
    to_stationID = result[0][0]
    week = Week[datetime.strptime("2020" + month + date, "%Y%m%d").weekday()]
    if trType == "TRA":
        query = 'SELECT from_time.TrainNo AS TrainNo, from_time.ArrivalHour AS ArrivalHour, from_time.ArrivalMin AS ArrivalMin, to_time.DepartureHour AS DepartureHour, to_time.DepartureMin AS DepartureMin, TRAtrainsInfo.TripLine AS TripLine, TRAtrainsInfo.TrainTypeName AS TrainTypeName \
            FROM (SELECT TrainNo, ArrivalHour, ArrivalMin, StopSequence \
            FROM TRAtrainsTime WHERE StationID = ' + str(from_stationID) + ' AND \
            ArrivalHour >= ' + str(h) + ' AND ArrivalMin >= ' + str(m) + ') AS from_time, \
            (SELECT TrainNo, DepartureHour, DepartureMin, StopSequence FROM TRAtrainsTime \
            WHERE StationID = ' + str(to_stationID) + ' AND DepartureHour >= ' + str(h) + ' AND \
            DepartureMin >= ' + str(m) + ') AS to_time, TRAtrainsDay, TRAtrainsInfo WHERE from_time.TrainNo = to_time.TrainNo AND TRAtrainsDay.TrainNo = from_time.TrainNo AND TRAtrainsInfo.TrainNo = from_time.TrainNo AND from_time.StopSequence < to_time.StopSequence AND TRAtrainsDay.' + week + ' = 1 \
            ORDER BY from_time.ArrivalHour, from_time.ArrivalMin'
    else:
         query = 'SELECT from_time.TrainNo AS TrainNo, from_time.DepartureHour AS DepartureHour, from_time.DepartureMin AS DepartureMin, to_time.DepartureHour AS DepartureHour, to_time.DepartureMin AS DepartureMin, THSRtrainsInfo.TripLine AS TripLine, THSRtrainsInfo.TrainTypeName AS TrainTypeName \
            FROM (SELECT TrainNo, DepartureHour, DepartureMin, StopSequence \
            FROM THSRtrainsTime WHERE StationID = ' + str(from_stationID) + ' AND \
            DepartureHour >= ' + str(h) + ' AND DepartureMin >= ' + str(m) + ') AS from_time, \
            (SELECT TrainNo, DepartureHour, DepartureMin, StopSequence FROM THSRtrainsTime \
            WHERE StationID = ' + str(to_stationID) + ' AND DepartureHour >= ' + str(h) + ' AND \
            DepartureMin >= ' + str(m) + ') AS to_time, THSRtrainsDay WHERE from_time.TrainNo = to_time.TrainNo AND THSRtrainsDay.TrainNo = from_time.TrainNo AND from_time.StopSequence < to_time.StopSequence AND THSRtrainsDay.' + week + ' = 1 \
            ORDER BY from_time.DepartureHour, from_time.DepartureMin'
    mycursor.execute(query)
    result = mycursor.fetchall()
    if (len(result) == 0):
        return jsonify({'status':2})
    trains = []
    if trType == "TRA":
        for item in result:
            if (item[2] < 10):
                item[2] = '0' + item[2]
            if (item[4] < 10):
                item[4] = '0' + item[4]
            inside = {
                'TrainNo':item[0],
                'ArrivalTime':item[1]+':'+item[2],
                'DepartureTime':item[3]+':'+item[4],
                'TripLine':item[5],
                'TrainTypeName':item[6],
            }
            trains.append(inside)
    else:
        for item in result:
            if (item[2] < 10):
                item[2] = '0' + item[2]
            inside = {
                'TrainNo':item[0],
                'DepartureTime':item[1]+':'+item[2],
            }
    return jsonify({'trains':trains,'status':3})

if __name__ == "__main__":        # on running python app.py
    app.run()                     # run the flask app
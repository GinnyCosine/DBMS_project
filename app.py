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

# Authorization
from hashlib import sha1
import hmac
from wsgiref.handlers import format_date_time
from time import mktime
import base64
import requests
from pprint import pprint

app_id = '27fc8c10e9024b07ad6c724a4a2bc9f8'
app_key = 'YciHt1dDF6nEW0_XL1K89EYVZ9U'

class Auth():

    def __init__(self, app_id, app_key):
        self.app_id = app_id
        self.app_key = app_key

    def get_auth_header(self):
        xdate = format_date_time(mktime(datetime.now().timetuple()))
        hashed = hmac.new(self.app_key.encode('utf8'), ('x-date: ' + xdate).encode('utf8'), sha1)
        signature = base64.b64encode(hashed.digest()).decode()

        authorization = 'hmac username="' + self.app_id + '", ' + \
                        'algorithm="hmac-sha1", ' + \
                        'headers="x-date", ' + \
                        'signature="' + signature + '"'
        return {
            'Authorization': authorization,
            'x-date': format_date_time(mktime(datetime.now().timetuple())),
            'Accept - Encoding': 'gzip'
        }


# Initial set
Week = ['Mon','Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

# create an app instance
app = Flask(__name__)

user_ = ''

# at the end point / 根目錄
@app.route("/")
def index():
    return render_template('index.html')

@app.route("/publicTransportation")
def publicTran():
    return render_template('publicTran.html')

@app.route("/train/<trType>/<trainNo>")
def train(trType, trainNo):
    return render_template('train.html')

@app.route("/myRoute")
def myRoute():
    return render_template('myRoute.html')

@app.route("/getTrain", methods = ['POST'])
def getTrain():
    tmp = request.json['url'].split('/')
    train_type = tmp[4]
    train_no = tmp[5]
    mycursor.execute('SELECT ' + train_type + 'stations.StationName, ' + train_type + \
                     'trainsTime.DepartureHour, ' + train_type + 'trainsTime.DepartureMin \
                     FROM ' + train_type + 'trainsTime, ' + train_type + 'stations \
                     WHERE ' + train_type + 'trainsTime.StationID =  ' + train_type + 'stations.StationID \
                     AND TrainNo = ' + train_no + ' ORDER BY StopSequence')
    result = mycursor.fetchall()
    return jsonify({'stations':result, 'TrainNo':train_no})

# request pwd of user
@app.route("/login", methods = ['POST'])
def user_login():
    user = request.json['user']
    pwd = request.json['pwd']
    mycursor.execute('SELECT pwd FROM UserInfo WHERE user = "' + user + '"')
    result = mycursor.fetchall()
    if len(result) == 0:
        return jsonify({'status':1})   # user not exists
    elif result[0][0] != pwd:
        return jsonify({'status':2})   # wrong password
    else:
        global user_
        user_= user
        return jsonify({'status':3})   # success

@app.route("/logout", methods = ['GET'])
def user_logout():
    global user_
    user_= ''
    return jsonify({'status':1})

@app.route("/user_name", methods = ['GET'])
def user_name():
    if len(user_) == 0:
        return jsonify({'status':1, 'userName':'GUEST'})
    else:
        return jsonify({'status':2, 'userName':user_})

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
    return jsonify({'status':'ok'})   # success

# get bus route options from city
@app.route("/busRouteFromCity", methods = ['POST'])
def busRouteFromCity():
    city = request.json['city']
    mycursor.execute('SELECT cityEn FROM Cities WHERE cityZh = "' + city + '"')
    result = mycursor.fetchall()
    if (len(result) == 0):
        return jsonify({'status':1})
    cityEn = result[0][0]
    mycursor.execute('SELECT RouteName FROM busRoute WHERE City = "' + cityEn + '" ORDER BY RouteName')
    result = mycursor.fetchall()
    routes = []
    for route in result:
        routes.append({'route':route[0]})
    return jsonify({'status':2, 'routes':routes})

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

# get bus route result
@app.route("/BusResult", methods = ['POST'])
def BusResult():
    city = request.json['city']
    routeName = request.json['routeName']
    mycursor.execute('SELECT cityEn FROM Cities WHERE cityZh = "' + city + '"')
    result = mycursor.fetchall()
    if (len(result) == 0):
        return jsonify({'status':1})
    cityEn = result[0][0]
    mycursor.execute('SELECT RouteID, DepartureStopName, DestinationStopName FROM busRoute \
        WHERE City = "' + cityEn + '" AND RouteName = "' + routeName + '"')
    result = mycursor.fetchall()
    if (len(result) == 0):
        return jsonify({'status':2})
    RouteID = result[0][0]
    DepartureStopName =  result[0][1]
    DestinationStopName =  result[0][2]
    mycursor.execute('SELECT StopName FROM busRouteStops WHERE Direction = 0 \
        AND RouteID = "' + RouteID + '" ORDER BY StopSequence')
    dir0 = mycursor.fetchall()
    mycursor.execute('SELECT StopName FROM busRouteStops WHERE Direction = 1 \
        AND RouteID = "' + RouteID + '" ORDER BY StopSequence')
    dir1 = mycursor.fetchall()
    mycursor.execute('SELECT StopName FROM busRouteStops WHERE Direction = 2 \
        AND RouteID = "' + RouteID + '" ORDER BY StopSequence')
    dir2 = mycursor.fetchall()
    a = Auth(app_id, app_key)
    response = requests.get("https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/"+cityEn+"/1?$format=JSON&$filter=RouteName/Zh_tw eq '"+routeName+"'", headers= a.get_auth_header())
    data = json.loads(response.text)
    if len(data) == 0:
        return jsonify({'status':4})
    stops = {}
    for st in data:
        StopName = st['StopName']['Zh_tw']
        Direction = st['Direction']
        StopStatus = st['StopStatus']
        if "EstimateTime" in st:
            Time = str(int(round(int(st['EstimateTime'])/60, 0)))
        elif 'NextBusTime' in st:
            Time  = st['NextBusTime']
        else:
            continue
        sub = {'StopStatus':StopStatus, 'NextBusTime':Time}
        if StopName in stops:
            stops[StopName][Direction] = sub
        else:
            stops[StopName] = {Direction:sub}
    if len(stops) == 0:
        return jsonify({'status':4})
    outbound = []
    for st in dir0:
        if st[0] not in stops:
            continue
        if 0 in stops[st[0]]:
            idx = 0
        # elif 255 in stops[st[0]]:
        #     idx = 255
        else:
            continue
        StopStatus = stops[st[0]][idx]['StopStatus']
        if StopStatus == 1:
            if ':' in stops[st[0]][idx]['NextBusTime']:
                show = '尚未發車 ' + stops[st[0]][idx]['NextBusTime'][11:16]
            else:
                show = '尚未發車 ' + stops[st[0]][idx]['NextBusTime']+'分'
        elif StopStatus == 2:
            show = '交管不停靠'
        elif StopStatus == 3:
            show = '末班車已過'
        elif StopStatus == 3:
            show = '今日未營運'
        else:
            if ':' in stops[st[0]][idx]['NextBusTime']:
                show = stops[st[0]][idx]['NextBusTime'][11:16]
            else:
                show = stops[st[0]][idx]['NextBusTime']+'分'
        outbound.append({'StopName':st[0], 'show':show})
    inbound = []
    for st in dir1:
        if st[0] not in stops:
            continue
        if 1 in stops[st[0]]:
            idx = 1
        # elif 255 in stops[st[0]]:
        #     idx = 255
        else:
            continue
        StopStatus = stops[st[0]][idx]['StopStatus']
        if StopStatus == 1:
            if ':' in stops[st[0]][idx]['NextBusTime']:
                show = '尚未發車 ' + stops[st[0]][idx]['NextBusTime'][11:16]
            else:
                show = '尚未發車 ' + stops[st[0]][idx]['NextBusTime']+'分'
        elif StopStatus == 2:
            show = '交管不停靠'
        elif StopStatus == 3:
            show = '末班車已過'
        elif StopStatus == 3:
            show = '今日未營運'
        else:
            if ':' in stops[st[0]][idx]['NextBusTime']:
                show = stops[st[0]][idx]['NextBusTime'][11:16]
            else:
                show = stops[st[0]][idx]['NextBusTime']+'分'
        inbound.append({'StopName':st[0], 'show':show})
    cycle = []
    for st in dir2:
        if st[0] not in stops:
            continue
        if 2 in stops[st[0]]:
            idx = 2
        # elif 255 in stops[st[0]]:
        #     idx = 255
        else:
            continue
        StopStatus = stops[st[0]][idx]['StopStatus']
        if StopStatus == 1:
            if ':' in stops[st[0]][idx]['NextBusTime']:
                show = '尚未發車 ' + stops[st[0]][idx]['NextBusTime'][11:16]
            else:
                show = '尚未發車 ' + stops[st[0]][idx]['NextBusTime']+'分'
        elif StopStatus == 2:
            show = '交管不停靠'
        elif StopStatus == 3:
            show = '末班車已過'
        elif StopStatus == 3:
            show = '今日未營運'
        else:
            if ':' in stops[st[0]][idx]['NextBusTime']:
                show = stops[st[0]][idx]['NextBusTime'][11:16]
            else:
                show = stops[st[0]][idx]['NextBusTime']+'分'
        cycle.append({'StopName':st[0], 'show':show})
    if len(dir2) == 0:
        return jsonify({'status':3, 'outbound':outbound, 'inbound':inbound, 'outboundName': '往'+\
            DestinationStopName, 'inboundName':'往'+DepartureStopName})
    else:
        return jsonify({'status':5, 'cycle':cycle, 'cycleName':DestinationStopName+' - '+DepartureStopName})

#　Railway query
@app.route("/RailwayResult/<trType>", methods = ['POST'])
def RailwayResult(trType):
    from_station = request.json['from_station']
    to_station = request.json['to_station']
    m = request.json['min']
    h = request.json['hour']
    date = request.json['date']
    month = request.json['month']
    print(m)
    print(h)
    print(month)
    print(date)
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
    week = Week[datetime.strptime("2020" + str(month) + str(date), "%Y%m%d").weekday()]
    if trType == "TRA":
        query = 'SELECT from_time.TrainNo AS TrainNo, from_time.DepartureHour AS DepartureHour, from_time.DepartureMin AS DepartureMin, to_time.ArrivalHour AS ArrivalHour, to_time.ArrivalMin AS ArrivalMin, TRAtrainsInfo.TrainTypeName AS TrainTypeName \
            FROM (SELECT TrainNo, ArrivalHour, ArrivalMin, StopSequence \
            FROM TRAtrainsTime WHERE StationID = ' + str(to_stationID) + ' AND \
            (ArrivalHour > ' + str(h) + ' OR (ArrivalHour = '+ str(h) + ' AND ArrivalMin >= ' + str(m) + '))) AS to_time, \
            (SELECT TrainNo, DepartureHour, DepartureMin, StopSequence FROM TRAtrainsTime \
            WHERE StationID = ' + str(from_stationID) + ' AND (DepartureHour > ' + str(h) + ' OR (DepartureHour = '+ str(h) + ' AND DepartureMin >= ' + str(m) + '))) AS from_time, TRAtrainsDay, TRAtrainsInfo \
                WHERE from_time.TrainNo = to_time.TrainNo AND TRAtrainsDay.TrainNo = from_time.TrainNo AND TRAtrainsInfo.TrainNo = from_time.TrainNo AND from_time.StopSequence < to_time.StopSequence AND TRAtrainsDay.' + week + ' = 1 \
            ORDER BY from_time.DepartureHour, from_time.DepartureMin'
    else:
         query = 'SELECT from_time.TrainNo AS TrainNo, from_time.DepartureHour AS DepartureHour, from_time.DepartureMin AS DepartureMin, to_time.DepartureHour AS ArrivalHour, to_time.DepartureMin AS ArrivalMin \
            FROM (SELECT TrainNo, DepartureHour, DepartureMin, StopSequence \
            FROM THSRtrainsTime WHERE StationID = ' + str(from_stationID) + ' AND \
            (DepartureHour > ' + str(h) + ' OR (DepartureHour = '+ str(h) + ' AND DepartureMin >= ' + str(m) + '))) AS from_time, \
            (SELECT TrainNo, DepartureHour, DepartureMin, StopSequence FROM THSRtrainsTime \
            WHERE StationID = ' + str(to_stationID) + ' AND (DepartureHour > ' + str(h) + ' OR (DepartureHour = '+ str(h) + ' AND DepartureMin >= ' + str(m) + '))) AS to_time, THSRtrainsDay WHERE from_time.TrainNo = to_time.TrainNo AND THSRtrainsDay.TrainNo = from_time.TrainNo AND from_time.StopSequence < to_time.StopSequence AND THSRtrainsDay.' + week + ' = 1 \
            ORDER BY from_time.DepartureHour, from_time.DepartureMin'
    mycursor.execute(query)
    result = mycursor.fetchall()
    if (len(result) == 0):
        return jsonify({'status':2})
    trains = []
    if trType == "TRA":
        for item in result:
            if (item[2] < 10):
                dm = '0' + str(item[2])
            else:
                dm = str(item[2])
            if (item[4] < 10):
                am = '0' + str(item[4])
            else:
                am = str(item[4])
            mins = int(item[4]) - int(item[2])
            hours = int(item[3]) - int(item[1])
            if (mins < 0):
                mins += 60
                hours -= 1
            if (hours != 0):
                dur = str(hours)+'時'+str(mins)+'分'
            else:
                dur = str(mins)+'分'
            inside = {
                'TrainNo':item[0],
                'DepartureTime':str(item[1])+':'+dm,
                'ArrivalTime':str(item[3])+':'+am,
                'TrainTypeName':item[5],
                'Duration': dur
            }
            trains.append(inside)
    else:
        for item in result:
            if (item[2] < 10):
                dm = '0' + str(item[2])
            else:
                dm = str(item[2])
            if (item[4] < 10):
                am = '0' + str(item[4])
            else:
                am = str(item[4])
            inside = {
                'TrainNo':item[0],
                'DepartureTime':str(item[1])+':'+dm,
                'ArrivalTime':str(item[3])+':'+am
            }
            trains.append(inside)
    return jsonify({'trains':trains,'status':3})

@app.route("/updateRailwaySearchRecord/<trType>", methods = ['POST'])
def updateRailwaySearchRecord(trType):
    mycursor.execute('SELECT COUNT(*) FROM User'+trType+'record WHERE user = "'+user_+'"')
    result = mycursor.fetchall()
    total = result[0][0]
    mycursor.execute('SELECT City FROM '+trType+'stations WHERE StationName = "'+request.json['from_station']+'"')
    result = mycursor.fetchall()
    from_city = result[0][0]
    mycursor.execute('SELECT City FROM '+trType+'stations WHERE StationName = "'+request.json['to_station']+'"')
    result = mycursor.fetchall()
    to_city = result[0][0]
    cur = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    if total < 5:
        mycursor.execute('INSERT INTO User'+trType+'record \
            (user, fromStationName, fromCity, toStationName, toCity, searchTime) VALUES ("' \
            + user_ + '","'+ request.json['from_station'] +'","'+from_city+'","'+\
            request.json['to_station']+'","'+to_city+'","'+cur+'")')
        connection.commit()
        return jsonify({'status':1})
    else:
        mycursor.execute('SELECT MIN(searchTime) FROM User'+trType+'record WHERE user = "'+user_+'"')
        result = mycursor.fetchall()
        min_time = result[0][0]
        mycursor.execute('DELETE FROM User'+trType+'record WHERE searchTime = "'+str(min_time)+'" AND user = "'+user_+'"')
        connection.commit()
        mycursor.execute('INSERT INTO User'+trType+'record \
            (user, fromStationName, fromCity, toStationName, toCity, searchTime) VALUES ("' \
            + user_ + '","'+ request.json['from_station'] +'","'+from_city+'","'+\
            request.json['to_station']+'","'+to_city+'","'+cur+'")')
        connection.commit()
        return jsonify({'status':2})

@app.route("/updateBusSearchRecord", methods = ['POST'])
def updateBusSearchRecord():
    mycursor.execute('SELECT COUNT(*) FROM UserBusRecord WHERE user = "'+user_+'"')
    result = mycursor.fetchall()
    total = result[0][0]
    cur = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    if total < 5:
        mycursor.execute('INSERT INTO UserBusRecord (user, RouteName, City, searchTime) VALUES ("' \
        + user_ + '","'+ request.json['route'] +'","'+request.json['city']+'","'+cur+'")')
        connection.commit()
        return jsonify({'status':1})
    else:
        mycursor.execute('SELECT MIN(searchTime) FROM UserBusRecord WHERE user = "'+user_+'"')
        result = mycursor.fetchall()
        min_time = result[0][0]
        mycursor.execute('DELETE FROM UserBusRecord WHERE searchTime = "'+str(min_time)+'" AND user = "'+user_+'"')
        connection.commit()
        mycursor.execute('INSERT INTO UserBusRecord (user, RouteName, City, searchTime) VALUES ("' \
        + user_ + '","'+ request.json['route'] +'","'+request.json['city']+'","'+cur+'")')
        connection.commit()
        return jsonify({'status':2})

@app.route("/getSearchRecord/<trType>/<target>", methods = ['GET'])
def getSearchRecord(trType, target):
    mycursor.execute('SELECT DISTINCT('+target+') FROM User'+trType+'Record \
         WHERE user = "'+user_+'" ORDER BY searchTime DESC')
    result = mycursor.fetchall()
    records = []
    for rec in result:
        records.append({"target":rec[0]})
    return jsonify({'records':records})

@app.route("/serchRailway/<trType>", methods = ['POST'])
def serchRailway(trType):
    mycursor.execute('SELECT StationID FROM ' + trType + 'stations WHERE StationName = "' + request.json['station'] + '"')
    result = mycursor.fetchall()
    if len(result) == 0:
        return jsonify({'status':1})
    else:
        return jsonify({'status':2, 'stationID':result[0][0]})

@app.route("/addMyRoute", methods = ['POST'])
def addMyRoute():
    mycursor.execute('SELECT COUNT(DISTINCT(ID)) FROM UserMyRoute WHERE user = "' + user_ + '"')
    result = mycursor.fetchall()
    ID = int(result[0][0]) + 1
    seq = 1
    for each in request.json['routes']:
        mycursor.execute('INSERT INTO UserMyRoute (user, ID, sequence, type, fromID ,toID) VALUES ("' \
        + user_ + '","'+ str(ID) +'","'+str(seq)+'","'+each['type']+'","'+str(each['from'])+'","'+str(each['to'])+'")')
        connection.commit()
        seq += 1
    return jsonify({'status':1})

@app.route("/getMyRoutes", methods = ['GET'])
def getMyRoutes():
    mycursor.execute('SELECT ID, sequence, type, fromID, toID FROM UserMyRoute WHERE user = "' + user_ + '"')
    result = mycursor.fetchall()
    if (len(result) == 0):
        return jsonify({'status':1})
    routes = {}
    for each in result:
        mycursor.execute('SELECT StationName FROM ' + str(each[2]) + 'stations WHERE StationID = "' + str(each[3]) + '"')
        f = mycursor.fetchall()
        f_name = f[0][0]
        mycursor.execute('SELECT StationName FROM ' + str(each[2]) + 'stations WHERE StationID = "' + str(each[4]) + '"')
        i = mycursor.fetchall()
        i_name = i[0][0]
        ID = str(each[0])
        if ID in routes:
            routes[ID].append({'type':each[2],'from':f_name, 'to':i_name})
        else:
            routes[ID] = [{'type':each[2],'from':f_name, 'to':i_name}]
    return jsonify({'status':2, 'routes':routes, 'cnt': result[len(result)-1][0]})

@app.route("/deleteMyRoute/<routeID>", methods = ['GET'])
def deleteMyRoute(routeID):
    mycursor.execute('SELECT COUNT(DISTINCT(ID)) FROM UserMyRoute WHERE user = "' + user_ + '"')
    result = mycursor.fetchall()
    total = result[0][0]
    mycursor.execute('DELETE FROM UserMyRoute WHERE user = "' + user_ + '" AND ID = '+str(routeID))
    connection.commit()
    for idx in range(int(routeID),int(total)):
        mycursor.execute('UPDATE UserMyRoute SET ID = '+ str(idx) +' WHERE user = "' + user_ + '" AND ID = '+str(idx+1))
        connection.commit()
    return jsonify({'status':1})

@app.route("/queryMyRoute/<routeID>", methods = ['GET'])
def queryMyRoute(routeID):
    month = datetime.now().month
    day = datetime.now().day
    h = datetime.now().hour
    m = datetime.now().minute
    week = Week[datetime.strptime("2020" + str(month) + str(day), "%Y%m%d").weekday()]
    from_clauses = 'FROM '
    where_clauses = 'WHERE '
    order_clauses = 'ORDER BY '
    mycursor.execute('SELECT ID,sequence,type,fromID,toID FROM UserMyRoute WHERE user = "' + user_ + '" AND ID = '+str(routeID))
    result = mycursor.fetchall()
    for each in result:
        if each[2] == "TRA":
            from_ = \
              '(SELECT from_time.TrainNo AS TrainNo, \
                from_time.DepartureHour AS DepartureHour, from_time.DepartureMin AS DepartureMin, \
                to_time.ArrivalHour AS ArrivalHour, to_time.ArrivalMin AS ArrivalMin \
                FROM (SELECT TrainNo, ArrivalHour, ArrivalMin, StopSequence FROM TRAtrainsTime \
                      WHERE StationID = ' + str(each[4]) + ' AND (ArrivalHour > ' + str(h) + \
                        ' OR (ArrivalHour = '+ str(h) + ' AND ArrivalMin >= ' + str(m) + '))) AS to_time, \
                     (SELECT TrainNo, DepartureHour, DepartureMin, StopSequence FROM TRAtrainsTime \
                      WHERE StationID = ' + str(each[3]) + ' AND (DepartureHour > ' + str(h) + \
                        ' OR (DepartureHour = '+ str(h) + ' AND DepartureMin >= ' + str(m) + '))) AS from_time, \
                     TRAtrainsDay \
                WHERE from_time.TrainNo = to_time.TrainNo AND TRAtrainsDay.TrainNo = from_time.TrainNo \
                      AND from_time.StopSequence < to_time.StopSequence AND TRAtrainsDay.' + week + ' = 1 \
                ORDER BY from_time.DepartureHour, from_time.DepartureMin) AS seq'+str(each[1])
        else:
            from_ = \
              '(SELECT from_time.TrainNo AS TrainNo, \
                from_time.DepartureHour AS DepartureHour, from_time.DepartureMin AS DepartureMin, \
                to_time.DepartureHour AS ArrivalHour, to_time.DepartureMin AS ArrivalMin \
                FROM (SELECT TrainNo, DepartureHour, DepartureMin, StopSequence FROM THSRtrainsTime \
                      WHERE StationID = ' + str(each[3]) + ' AND (DepartureHour > ' + str(h) + \
                        ' OR (DepartureHour = '+ str(h) + ' AND DepartureMin >= ' + str(m) + '))) AS from_time, \
                     (SELECT TrainNo, DepartureHour, DepartureMin, StopSequence FROM THSRtrainsTime \
                      WHERE StationID = ' + str(each[4]) + ' AND (DepartureHour > ' + str(h) + \
                        ' OR (DepartureHour = '+ str(h) + ' AND DepartureMin >= ' + str(m) + '))) AS to_time, \
                     THSRtrainsDay \
                WHERE from_time.TrainNo = to_time.TrainNo AND THSRtrainsDay.TrainNo = from_time.TrainNo \
                      AND from_time.StopSequence < to_time.StopSequence AND THSRtrainsDay.' + week + ' = 1 \
                ORDER BY from_time.DepartureHour, from_time.DepartureMin) AS seq'+str(each[1])
        order_clauses += 'seq'+str(each[1])+'.DepartureHour, seq'+str(each[1])+'.DepartureMin'
        from_clauses += from_ +' '
        if each[1] > 1:
            where_clauses += '(((seq'+str(each[1])+'.DepartureHour - seq'+str(each[1]-1)+'.ArrivalHour) * 60 + \
                              (seq'+str(each[1])+'.DepartureMin - seq'+str(each[1]-1)+'.ArrivalMin)) BETWEEN 10 AND 30)'
        if each[1] < len(result):
            from_clauses += ', '
            order_clauses += ', '
        if each[1] > 1 and each[1] < len(result):
            where_clauses += ' AND '
    select_clause = 'SELECT * '
    length = result[len(result)-1][1]
    if length <= 1:
        where_clauses = ''
    query = select_clause + from_clauses + where_clauses + order_clauses
    print(query)
    mycursor.execute(query)
    result2 = mycursor.fetchall()
    if len(result2) == 0:
        return jsonify({'status':2})
    return jsonify({'status':1, 'result': result2, 'length':length})

if __name__ == "__main__":        # on running python app.py
    app.run()                     # run the flask app
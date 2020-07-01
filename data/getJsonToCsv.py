from bs4 import BeautifulSoup
from selenium import webdriver
import json
import csv

def get_json(url,driver):
    driver.get(url)
    page = driver.page_source
    soup = BeautifulSoup(page,"html.parser")
    info = soup.select('pre')[0]
    return info.text

# Initial set
driver = webdriver.Chrome()
citys = ['Taipei','NewTaipei','Taoyuan','Taichung','Tainan','Kaohsiung','Keelung','Hsinchu','HsinchuCounty','MiaoliCounty','ChanghuaCounty','NantouCounty','YunlinCounty','ChiayiCounty','Chiayi','PingtungCounty','YilanCounty','HualienCounty','TaitungCounty','KinmenCounty','PenghuCounty','LienchiangCounty']
format_ = '?$format=JSON'

###################
#### bus route ####
###################
# origin = 'https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/'
# select_ = '$select=RouteUID,RouteName,DepartureStopNameZh,DestinationStopNameZh,City,CityCode&'
# filter_ = '$filter=BusRouteType eq 11'
#
# with open('busRoute.csv', 'w', newline='') as csvfile:
#     writer = csv.writer(csvfile)
#     writer.writerow(['RouteUID', 'City', 'RouteName', 'DepartureStopName','DestinationStopName'])
#     for city in citys:
#         url = origin + city + format_ + select_ + filter_
#         json_data = get_json(url, driver)
#         data = json.loads(json_data)
#         for item in data:
#             writer.writerow([item['RouteUID'], item['City'], item['RouteName']['Zh_tw'], item['DepartureStopNameZh'], item['DestinationStopNameZh']])

#########################
#### bus route stops ####
#########################
# origin = "https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/"
# select_ = "&$select=RouteUID,Direction,Stops"
# filter_ = "&$filter=City ne ''"
# with open('busRouteStops.csv', 'w', newline='') as csvfile:
#     writer = csv.writer(csvfile)
#     writer.writerow(['RouteUID', 'Direction', 'StopUID', 'StopName', 'StopSequence'])
#     for city in citys:
#         url = origin + city + format_ + select_ + filter_
#         json_data = get_json(url,driver)
#         data = json.loads(json_data)
#         for item in data:
#             for stop in item['Stops']:
#                 writer.writerow([item['RouteUID'], item['Direction'], stop['StopUID'], stop['StopName']['Zh_tw'], stop['StopSequence']])

######################
#### TRA stations ####
######################
origin = 'https://ptx.transportdata.tw/MOTC/v2/Rail/TRA/Station'
select_ = "&$select=StationID,StationName,StationAddress"
with open('TRAstations.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['StationID', 'StationName','City'])
    url = origin + format_ + select_
    json_data = get_json(url,driver)
    data = json.loads(json_data)
    for item in data:
        writer.writerow([int(item['StationID']), item['StationName']['Zh_tw'],item['StationAddress'][5:8]])


#########################
#### TRA trains info ####
#########################
origin = 'https://ptx.transportdata.tw/MOTC/v2/Rail/TRA/GeneralTrainInfo'
select_ = "&$select=TrainNo,Direction,StartingStationID,EndingStationID,TripLine,TrainTypeName"
tripTypes = {0:'不經山海線',1:'山線',2:'海線',3:''}
with open('TRAtrainsInfo.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['TrainNo', 'Direction', 'StartingStationID' ,'EndingStationID','TripLine','TrainTypeName'])
    url = origin + format_ + select_
    json_data = get_json(url,driver)
    data = json.loads(json_data)
    for item in data:
        TrainTypeName = item['TrainTypeName']['Zh_tw']
        tripType = tripTypes[item['TripLine']]
        if len(TrainTypeName) > 3:
            TrainTypeName = TrainTypeName[0:2]    
        writer.writerow([int(item['TrainNo']), item['Direction'], int(item['StartingStationID']) ,int(item['EndingStationID']), tripType, TrainTypeName])

#########################
#### TRA trains time ####
#########################
origin = 'https://ptx.transportdata.tw/MOTC/v2/Rail/TRA/GeneralTimetable'
select_ = "&$select=GeneralTimetable"
with open('TRAtrainsTime.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['TrainNo', 'StationID', 'ArrivalTime', 'DepartureTime', 'StopSequence'])
    url = origin + format_ + select_
    json_data = get_json(url,driver)
    data = json.loads(json_data)
    for item in data:
        for station in item['GeneralTimetable']['StopTimes']:
            writer.writerow([int(item['GeneralTimetable']['GeneralTrainInfo']['TrainNo']), int(station['StationID']), station['ArrivalTime'] ,station['DepartureTime'] ,station['StopSequence']])

#########################
#### TRA trains day #####
#########################
# origin = 'https://ptx.transportdata.tw/MOTC/v2/Rail/TRA/GeneralTimetable'
# select_ = "&$select=GeneralTimetable"
# with open('TRAtrainsDay.csv', 'w', newline='') as csvfile:
#     writer = csv.writer(csvfile)
#     writer.writerow(['TrainNo', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
#     url = origin + format_ + select_
#     json_data = get_json(url,driver)
#     data = json.loads(json_data)
#     for item in data:
#         writer.writerow([int(item['GeneralTimetable']['GeneralTrainInfo']['TrainNo']), item['GeneralTimetable']['ServiceDay']['Monday'], item['GeneralTimetable']['ServiceDay']['Tuesday'], item['GeneralTimetable']['ServiceDay']['Wednesday'], item['GeneralTimetable']['ServiceDay']['Thursday'], item['GeneralTimetable']['ServiceDay']['Friday'], item['GeneralTimetable']['ServiceDay']['Saturday'], item['GeneralTimetable']['ServiceDay']['Sunday']])


###############################
#### THSR trains stations #####
###############################
# origin = 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/Station'
# select_ = "&$select=StationID,StationName,StationAddress"
# with open('THSRstations.csv', 'w', newline='') as csvfile:
#     writer = csv.writer(csvfile)
#     writer.writerow(['StationID', 'StationName','City'])
#     url = origin + format_ + select_
#     json_data = get_json(url,driver)
#     data = json.loads(json_data)
#     for item in data:
#         writer.writerow([int(item['StationID']), item['StationName']['Zh_tw'],item['StationAddress'][0:3]])


##########################
#### THSR trains Info ####
##########################
origin = 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/GeneralTimetable'
select_ = "&$select=GeneralTimetable"
with open('THSRtrainsInfo.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['TrainNo', 'Direction', 'StartingStationID', 'EndingStationID'])
    url = origin + format_ + select_
    json_data = get_json(url,driver)
    data = json.loads(json_data)
    for item in data:
        writer.writerow([int(item['GeneralTimetable']['GeneralTrainInfo']['TrainNo']), item['GeneralTimetable']['GeneralTrainInfo']['Direction'], int(item['GeneralTimetable']['GeneralTrainInfo']['StartingStationID']), int(item['GeneralTimetable']['GeneralTrainInfo']['EndingStationID'])])

##########################
#### THSR trains time ####
##########################
origin = 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/GeneralTimetable'
select_ = "&$select=GeneralTimetable"
with open('THSRtrainsTime.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['TrainNo', 'StationID', 'DepartureTime', 'StopSequence'])
    url = origin + format_ + select_
    json_data = get_json(url,driver)
    data = json.loads(json_data)
    for item in data:
        for station in item['GeneralTimetable']['StopTimes']:
            writer.writerow([int(item['GeneralTimetable']['GeneralTrainInfo']['TrainNo']), int(station['StationID']), station['DepartureTime'] ,station['StopSequence']])

##########################
#### THSR trains day #####
##########################
origin = 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/GeneralTimetable'
select_ = "&$select=GeneralTimetable"
with open('THSRtrainsDay.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['TrainNo', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    url = origin + format_ + select_
    json_data = get_json(url,driver)
    data = json.loads(json_data)
    for item in data:
        writer.writerow([int(item['GeneralTimetable']['GeneralTrainInfo']['TrainNo']), item['GeneralTimetable']['ServiceDay']['Monday'], item['GeneralTimetable']['ServiceDay']['Tuesday'], item['GeneralTimetable']['ServiceDay']['Wednesday'], item['GeneralTimetable']['ServiceDay']['Thursday'], item['GeneralTimetable']['ServiceDay']['Friday'], item['GeneralTimetable']['ServiceDay']['Saturday'], item['GeneralTimetable']['ServiceDay']['Sunday']])

driver.close()
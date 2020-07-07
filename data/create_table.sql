create table busRoute(
    RouteID varchar(10) not NULL,
    City varchar(50) not NULL,
    RouteName varchar(60),
    DepartureStopName varchar(50),
    DestinationStopName varchar(50),
    primary key(routeID)
);

create table busRouteStops(
    RouteID varchar(10) not NULL,
    Direction int,
    StopID varchar(10),
    StopName varchar(50),
    StopSequence int,
    primary key(routeID, stopID, StopSequence),
    foreign key(routeID) references busRoute(routeID)
);

create table TRAstations(
    StationID int not NULL,
    StationName varchar(50),
    City varchar(50),
    primary key(StationID)
);

create table THSRstations(
    StationID int not NULL,
    StationName varchar(50),
    City varchar(50),
    primary key(StationID)
);

create table TRAtrainsDay(
    TrainNo int not NULL,
    Mon int,
    Tue int,
    Wed int,
    Thu int,
    Fri int,
    Sat int,
    Sun int,
    primary key(TrainNo)
);

create table THSRtrainsDay(
    TrainNo int not NULL,
    Mon int,
    Tue int,
    Wed int,
    Thu int,
    Fri int,
    Sat int,
    Sun int,
    primary key(TrainNo)
);

create table TRAtrainsInfo(
    TrainNo int not NULL,
    Direction int,
    StartingStationID int,
    EndingStationID int,
    TripLine varchar(50),
    TrainTypeName varchar(50),
    primary key(TrainNo)
);

create table THSRtrainsInfo(
    TrainNo int not NULL,
    Direction int,
    StartingStationID int,
    EndingStationID int,
    primary key(TrainNo)
);

create table TRAtrainsTime(
    TrainNo int not NULL,
    StationID int not NULL,
    ArrivalHour int,
    ArrivalMin int,
    DepartureHour int,
    DepartureMin int,
    StopSequence int,
    primary key(TrainNo, StopSequence),
    foreign key(TrainNo) references TRAtrainsInfo(TrainNo)
);

create table THSRtrainsTime(
    TrainNo int not NULL,
    StationID int not NULL,
    DepartureHour int,
    DepartureMin int,
    StopSequence int,
    primary key(TrainNo, StationID),
    foreign key(TrainNo) references THSRtrainsInfo(TrainNo)
);

create table UserInfo(
    user varchar(20) not NULL,
    pwd varchar(20) not NULL,
    primary key(user)
);

create table Cities(
    cityEn varchar(20) not NULL,
    cityZh varchar(20) not NULL,
    primary key(cityEn)
);

create table UserBusRecord(
    user varchar(20) not NULL,
    RouteName varchar(60) not NULL,
    City varchar(20) not NULL,
    searchTime TIMESTAMP ,
    primary key(user,searchTime)
);

create table UserTRArecord(
    user varchar(20) not NULL,
    fromStationName varchar(20) not NULL,
    fromCity varchar(20) not NULL,
    toStationName varchar(20) not NULL,
    toCity varchar(20) not NULL,
    searchTime TIMESTAMP ,
    primary key(user,searchTime)
);

create table UserTHSRrecord(
    user varchar(20) not NULL,
    fromStationName varchar(20) not NULL,
    fromCity varchar(20) not NULL,
    toStationName varchar(20) not NULL,
    toCity varchar(20) not NULL,
    searchTime TIMESTAMP ,
    primary key(user,searchTime)
);

create table UserMyRoute(
    user varchar(20) not NULL,
    ID int not NULL,
    sequence int not NULL,
    type varchar(20) not NULL ,
    fromID int not NULL,
    toID int not NULL,
    primary key(user,ID,sequence)
);
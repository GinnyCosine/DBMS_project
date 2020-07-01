
load data local infile './busRoute.csv'
into table busRoute
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines;

load data local infile './busRouteStops.csv'
into table busRouteStops
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines;

load data local infile './THSRstations.csv'
into table THSRstations
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines;

load data local infile './THSRtrainsDay.csv'
into table THSRtrainsDay
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines;

load data local infile './THSRtrainsInfo.csv'
into table THSRtrainsInfo
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines;

load data local infile './THSRtrainsTime.csv'
into table THSRtrainsTime
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines;

load data local infile './TRAstations.csv'
into table TRAstations
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines;

load data local infile './TRAtrainsDay.csv'
into table TRAtrainsDay
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines;

load data local infile './TRAtrainsInfo.csv'
into table TRAtrainsInfo
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines;

load data local infile './TRAtrainsTime.csv'
into table TRAtrainsTime
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines;
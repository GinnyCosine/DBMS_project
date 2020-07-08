$(document).ready(function(){

    City = ['桃園市','嘉義縣','彰化縣','嘉義市','新竹市','新竹縣','花蓮縣','宜蘭縣','屏東縣','高雄市','基隆市','金門縣','連江縣','苗栗縣','南投縣','澎湖縣','臺南市','臺北市','新北市','臺東縣','臺中市','雲林縣'];
    user = getUser();
    if (user['status'] == 2){
        $("#login").hide();
    }
    $("#login").click(function(){
        window.location.href = "http://127.0.0.1:5000/";
    });
    document.getElementById('user_name').innerHTML = 'Hi! ' + user['userName'];
    $(".menu li").eq(1).css('background','rgb(45, 121, 131)');
    $(".menu li").eq(1).css('color','#fff');

    $('#add_button').click(function(){
        $('#add').toggle(300);
        myRoute = [];
        myRoute_cnt = 0;
        document.getElementById('subroutes').innerHTML = '<button type="button" id="confirm">確定新增</button>';
    });

    if (user['status'] == 1){
        $("#add_button").hide();
        document.getElementById('inform').innerHTML = '本功能需登入以使用';
    }
    myRoute = [];
    tra_toStation = [];
    tra_fromStation = [];
    thsr_toStation = [];
    thsr_fromStation = [];
    // TRA_from

    $("#tra_from_city").click(function () {
        var keyin = document.getElementById('tra_from_city').value;
        var msg = document.getElementById('msg_tra_from_city');
        if (keyin.length == 0){
            var record = getSearchRecord("TRA",'fromCity');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
        }
    });

    // Filter city options from keyin
    $("#tra_from_city").keyup(function(){
        var keyin = document.getElementById('tra_from_city').value;
        var msg = document.getElementById('msg_tra_from_city');
        msg.innerHTML = '';
        if (keyin.length == 0){
            var record = getSearchRecord("TRA",'fromCity');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        for(i = 0; i< City.length; i++){
            if (keyin == City[i]){
                return;
            }
            if (City[i].includes(keyin))
                msg.innerHTML += '<div class="submsg">'+ City[i] + '</div>';
        }
    });

    // If one of the options is selected, hide options
    $("#msg_tra_from_city").on('click','.submsg',function(){
        var index = $(this).index();
        document.getElementById('tra_from_city').value = $('#msg_tra_from_city .submsg').eq(index).text();
        $('#msg_tra_from_city .submsg').hide();
    });

    // Add station options from city
    $('#tra_from_st').click(function(){
        var city = document.getElementById('tra_from_city').value;
        var msg = document.getElementById('msg_tra_from_st');
        if (city.length == 0){
            var record = getSearchRecord("TRA",'fromStationName');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        tra_fromStation = getRailwayStationsFromCity(city, "TRA");
        msg.innerHTML = '';
        for (i = 0; i < tra_fromStation.length; i++){
            msg.innerHTML += '<div class="submsg">'+ tra_fromStation[i]['stationName'] +'</div>';
        }
    });

    // Filter station options
    $('#tra_from_st').keyup(function(){
        var keyin = document.getElementById('tra_from_st').value;
        var msg = document.getElementById('msg_tra_from_st');
        if (keyin.length == 0){
            if (tra_fromStation.length != 0){
                return;
            }
            var record = getSearchRecord('TRA','fromStationName');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        if (tra_fromStation.length != 0){
            msg.innerHTML = '';
            for (i = 0; i < tra_fromStation.length; i++){
                var st = tra_fromStation[i]['stationName'];
                if (st.includes(keyin))
                    msg.innerHTML += '<div class="submsg">'+ st +'</div>';
            }
        }
        else {
            var stations = getRailwayStationsFromKeyin(keyin, "TRA");
            msg.innerHTML = '';
            for (i = 0; i < stations.length; i++){
                msg.innerHTML += '<div class="submsg">'+ stations[i]['stationName'] +'</div>';
            }
        }
    });

    // If one of the options is selected, hide options
    $("#msg_tra_from_st").on('click','.submsg',function(){
        var index = $(this).index();
        // console.log($('#msg_tra_from_st .submsg').eq(index).text())
        document.getElementById('tra_from_st').value = $('#msg_tra_from_st .submsg').eq(index).text();
        $('#msg_tra_from_st .submsg').hide();
    });

    // TRA_to

    $("#tra_to_city").click(function () {
        var keyin = document.getElementById('tra_to_city').value;
        var msg = document.getElementById('msg_tra_to_city');
        if (keyin.length == 0){
            var record = getSearchRecord('TRA','toCity');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
        }
    });

    // Filter city options from keyin
    $("#tra_to_city").keyup(function(){
        var keyin = document.getElementById('tra_to_city').value;
        var msg = document.getElementById('msg_tra_to_city');
        msg.innerHTML = '';
        if (keyin.length == 0){
            var record = getSearchRecord('TRA','toCity');
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        for(i = 0; i< City.length; i++){
            if (keyin == City[i]){
                return;
            }
            if (City[i].includes(keyin))
                msg.innerHTML += '<div class="submsg">'+City[i]+'</div>';
        }
    });

    // If one of the options is selected, hide options
    $("#msg_tra_to_city").on('click','.submsg',function(){
        var index = $(this).index();
        document.getElementById('tra_to_city').value = $('#msg_tra_to_city .submsg').eq(index).text();
        $('#msg_tra_to_city .submsg').hide();
    });

    // Add station options from city
    $('#tra_to_st').click(function(){
        var city = document.getElementById('tra_to_city').value;
        var msg = document.getElementById('msg_tra_to_st');
        if (city.length == 0){
            var record = getSearchRecord('TRA','toStationName');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        tra_toStation = getRailwayStationsFromCity(city, "TRA");
        console.log(tra_toStation);
        var tmp = '';
        for (i = 0; i < tra_toStation.length; i++){
            tmp += '<div class="submsg">'+ tra_toStation[i]['stationName'] +'</div>';
        }
        msg.innerHTML = tmp;
    });

    // Filter station options
    $('#tra_to_st').keyup(function(){
        var keyin = document.getElementById('tra_to_st').value;
        var msg = document.getElementById('msg_tra_to_st');
        if (keyin.length == 0){
            if (tra_toStation.length != 0)
                return;
            var record = getSearchRecord('TRA','toStationName');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        if (tra_toStation.length != 0){
            msg.innerHTML = '';
            for (i = 0; i < tra_toStation.length; i++){
                var st = tra_toStation[i]['stationName'];
                if (st.includes(keyin))
                    msg.innerHTML += '<div class="submsg">'+ st +'</div>';
            }
        }
        else {
            var stations = getRailwayStationsFromKeyin(keyin, "TRA");
            msg.innerHTML = '';
            for (i = 0; i < stations.length; i++){
                msg.innerHTML += '<div class="submsg">'+ stations[i]['stationName'] +'</div>';
            }
        }
    });

    // If one of the options is selected, hide options
    $("#msg_tra_to_st").on('click','.submsg',function(){
        var index = $(this).index();
        document.getElementById('tra_to_st').value = $('#msg_tra_to_st .submsg').eq(index).text();
        $('#msg_tra_to_st .submsg').hide();
    });

    // THSR_from
    // Filter city options from keyin
    $("#thsr_from_city").click(function () {
        var keyin = document.getElementById('thsr_from_city').value;
        var msg = document.getElementById('msg_thsr_from_city');
        if (keyin.length == 0){
            var record = getSearchRecord("THSR",'fromCity');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
        }
    });

    $("#thsr_from_city").keyup(function(){
        var keyin = document.getElementById('thsr_from_city').value;
        var msg = document.getElementById('msg_thsr_from_city');
        msg.innerHTML = '';
        if (keyin.length == 0){
            var record = getSearchRecord('THSR','fromCity');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        for(i = 0; i< City.length; i++){
            if (keyin == City[i]){
                return;
            }
            if (City[i].includes(keyin))
                msg.innerHTML += '<div class="submsg">'+ City[i] + '</div>';
        }
    });

    // If one of the options is selected, hide options
    $("#msg_thsr_from_city").on('click','.submsg',function(){
        var index = $(this).index();
        document.getElementById('thsr_from_city').value = $('#msg_thsr_from_city .submsg').eq(index).text();
        $('#msg_thsr_from_city .submsg').hide();
    });

    // Add station options from city
    $('#thsr_from_st').click(function(){
        var city = document.getElementById('thsr_from_city').value;
        var msg = document.getElementById('msg_thsr_from_st');
        if (city.length == 0){
            var record = getSearchRecord('THSR','fromStationName');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        thsr_fromStation = getRailwayStationsFromCity(city, "THSR");
        msg.innerHTML = '';
        for (i = 0; i < thsr_fromStation.length; i++){
            msg.innerHTML += '<div class="submsg">'+ thsr_fromStation[i]['stationName'] +'</div>';
        }
    });

    // Filter station options
    $('#thsr_from_st').keyup(function(){
        var keyin = document.getElementById('thsr_from_st').value;
        if (keyin.length == 0){
            if (thsr_fromStation.length != 0)
                return;
            var record = getSearchRecord('THSR','fromStationName');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        var msg = document.getElementById('msg_thsr_from_st');
        if (thsr_fromStation.length != 0){
            msg.innerHTML = '';
            for (i = 0; i < thsr_fromStation.length; i++){
                var st = thsr_fromStation[i]['stationName'];
                if (st.includes(keyin))
                    msg.innerHTML += '<div class="submsg">'+ st +'</div>';
            }
        }
        else {
            var stations = getRailwayStationsFromKeyin(keyin, "THSR");
            msg.innerHTML = '';
            for (i = 0; i < stations.length; i++){
                msg.innerHTML += '<div class="submsg">'+ stations[i]['stationName'] +'</div>';
            }
        }
    });

    // If one of the options is selected, hide options
    $("#msg_thsr_from_st").on('click','.submsg',function(){
        var index = $(this).index();
        // console.log($('#msg_thsr_from_st .submsg').eq(index).text())
        document.getElementById('thsr_from_st').value = $('#msg_thsr_from_st .submsg').eq(index).text();
        $('#msg_thsr_from_st .submsg').hide();
    });

    $("#thsr_to_city").click(function (){
        var keyin = document.getElementById('thsr_to_city').value;
        var msg = document.getElementById('msg_thsr_to_city');
        if (keyin.length == 0){
            var record = getSearchRecord("THSR",'toCity');
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
    });

    // THSR_to
    // Filter city options from keyin
    $("#thsr_to_city").keyup(function(){
        var keyin = document.getElementById('thsr_to_city').value;
        var msg = document.getElementById('msg_thsr_to_city');
        msg.innerHTML = '';
        if (keyin.length == 0){
            var record = getSearchRecord("THSR",'toCity');
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        for(i = 0; i< City.length; i++){
            if (keyin == City[i]){
                return;
            }
            if (City[i].includes(keyin))
                msg.innerHTML += '<div class="submsg">'+City[i]+'</div>';
        }
    });

    // If one of the options is selected, hide options
    $("#msg_thsr_to_city").on('click','.submsg',function(){
        var index = $(this).index();
        document.getElementById('thsr_to_city').value = $('#msg_thsr_to_city .submsg').eq(index).text();
        $('#msg_thsr_to_city .submsg').hide();
    });

    // Add station options from city
    $('#thsr_to_st').click(function(){
        var city = document.getElementById('thsr_to_city').value;
        var msg = document.getElementById('msg_thsr_to_st');
        if (city.length == 0){
            var record = getSearchRecord("THSR",'toStationName');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        thsr_toStation = getRailwayStationsFromCity(city, "THSR");
        msg.innerHTML = '';
        for (i = 0; i < thsr_toStation.length; i++){
            msg.innerHTML += '<div class="submsg">'+ thsr_toStation[i]['stationName'] +'</div>';
        }
    });

    // Filter station options
    $('#thsr_to_st').keyup(function(){
        var keyin = document.getElementById('thsr_to_st').value;
        if (keyin.length == 0){
            if (thsr_toStation.length != 0)
                return;
            var record = getSearchRecord("THSR",'toStationName');
            msg.innerHTML = '';
            for(i = 0; i< record.length; i++){
                msg.innerHTML += '<div class="submsg">'+ record[i]['target'] + '</div>';
            }
            return;
        }
        var msg = document.getElementById('msg_thsr_to_st');
        if (thsr_toStation.length != 0){
            msg.innerHTML = '';
            for (i = 0; i < thsr_toStation.length; i++){
                var st = thsr_toStation[i]['stationName'];
                if (st.includes(keyin))
                    msg.innerHTML += '<div class="submsg">'+ st +'</div>';
            }
        }
        else {
            var stations = getRailwayStationsFromKeyin(keyin, "THSR");
            msg.innerHTML = '';
            for (i = 0; i < stations.length; i++){
                msg.innerHTML += '<div class="submsg">'+ stations[i]['stationName'] +'</div>';
            }
        }
    });

    // If one of the options is selected, hide options
    $("#msg_thsr_to_st").on('click','.submsg',function(){
        var index = $(this).index();
        document.getElementById('thsr_to_st').value = $('#msg_thsr_to_st .submsg').eq(index).text();
        $('#msg_thsr_to_st .submsg').hide();
    });

    $("#tra_add").click(function(){
        if (myRoute_cnt >= 5){
            alert('已達路線上限');
            return;
        }
        var from_st = document.getElementById("tra_from_st").value;
        var to_st = document.getElementById("tra_to_st").value;
        if (from_st.length == 0 || to_st.length == 0) {
            alert('請輸入車站名');
            return;
        }
        var from_city = document.getElementById("tra_from_city").value;
        if (from_city.length > 0){
            var flag = 0;
            tra_fromStation = getRailwayStationsFromCity(from_city, "TRA");
            for (i = 0; i < tra_fromStation.length; i++){
                if (from_st == tra_fromStation[i]['stationName']){
                    flag = 1;
                    break;
                }
            }
            if (flag != 1){
                alert("縣市與站名不相符");
                return;
            }
        }
        var to_city = document.getElementById("tra_to_city").value;
        if (to_city.length > 0){
            var flag = 0;
            tra_toStation = getRailwayStationsFromCity(to_city, "TRA");
            for (i = 0; i < tra_toStation.length; i++){
                if (to_st == tra_toStation[i]['stationName']){
                    flag = 1;
                    break;
                }
            }
            if (flag != 1){
                alert("縣市與站名不相符")
                return;
            }
        }
        var result1 = serchRailway(from_st, "TRA");
        var result2 = serchRailway(to_st, "TRA");
        if (result1['status'] == 1 || result2['status'] == 1){
            alert('無效車站名');
            return;
        }

        // add
        myRoute_cnt++;
        var each = '<div class="subroute"><span>'+myRoute_cnt+' TRA '+from_st+' >>>> '+to_st+'</span></div>';
        document.getElementById('subroutes').innerHTML += each;
        myRoute.push({'type':'TRA','from':result1['stationID'], 'to':to_st['stationID']})
        myRoute.push({'type':'THSR','from':result1['stationID'], 'to':to_st['stationID']})
        var from_st = document.getElementById("tra_from_st").value = '';
        var to_st = document.getElementById("tra_to_st").value = '';
        var from_city = document.getElementById("tra_from_city").value = '';
        var to_city = document.getElementById("tra_to_city").value = '';
    });

    $("#thsr_add").click(function(){
        if (myRoute_cnt >= 5){
            alert('已達路線上限');
            return;
        }
        var from_st = document.getElementById("thsr_from_st").value;
        var to_st = document.getElementById("thsr_to_st").value;
        if (from_st.length == 0 || to_st.length == 0) {
            alert('請輸入車站名');
            return;
        }
        var from_city = document.getElementById("thsr_from_city").value;
        if (from_city.length > 0){
            var flag = 0;
            thsr_fromStation = getRailwayStationsFromCity(from_city, "THSR");
            for (i = 0; i < thsr_fromStation.length; i++){
                if (from_st == thsr_fromStation[i]['stationName']){
                    flag = 1;
                    break;
                }
            }
            if (flag != 1){
                alert("縣市與站名不相符")
                return;
            }
        }
        var to_city = document.getElementById("thsr_to_city").value;
        if (to_city.length > 0){
            var flag = 0;
            thsr_toStation = getRailwayStationsFromCity(to_city, "THSR");
            for (i = 0; i < thsr_toStation.length; i++){
                if (to_st == thsr_toStation[i]['stationName']){
                    flag = 1;
                    break;
                }
            }
            if (flag != 1){
                alert("縣市與站名不相符")
                return;
            }
        }
        var result1 = serchRailway(from_st, "THSR");
        var result2 = serchRailway(to_st, "THSR");
        if (result1['status'] == 1 || result2['status'] == 1){
            alert('無效車站名');
            return;
        }

        // add
        myRoute_cnt++;
        var each = '<div class="subroute"><span>'+myRoute_cnt+' THSR '+from_st+' >>>> '+to_st+'</span></div>';
        document.getElementById('subroutes').innerHTML += each;
        // myRoute_cnt++;
        myRoute.push({'type':'THSR','from':result1['stationID'], 'to':to_st['stationID']})
        var from_st = document.getElementById("thsr_from_st").value = '';
        var to_st = document.getElementById("thsr_to_st").value = '';
        var from_city = document.getElementById("thsr_from_city").value = '';
        var to_city = document.getElementById("thsr_to_city").value = '';
    });

    $("#subroutes").on('click','#confirm',function(){
        if (myRoute.length == 0){
            alert('尚未新增任何路線');
            return;
        }
        addMyRoute(myRoute);
    });

});

function addMyRoute(myRoute){
    var req_url = "http://127.0.0.1:5000/addMyRoute";
    var dataJSON = {
        "routes":myRoute
    };
    var status;
    $.ajax({ 
        url:req_url, 
        type: "POST", 
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(dataJSON),
        dataType: "json",
        async: false,
        success: function(data) {
            status = data['status'];
        }
    });
    return status;
}

function serchRailway(st, type){
    var req_url = "http://127.0.0.1:5000/serchRailway/"+type;
    var dataJSON = {
        "station":st
    };
    var result;
    $.ajax({ 
        url:req_url, 
        type: "POST", 
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(dataJSON),
        dataType: "json",
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
}

function getUser(){
    var req_url = "http://127.0.0.1:5000/user_name";
    var user;
    $.ajax({ 
        url:req_url, 
        type: "GET", 
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        async: false,
        success: function(data) {
            user = data;
        }
    });
    return user;
}

function getSearchRecord(type, target) {
    if (user['status'] == 1){
        return;
    }
    var req_url = "http://127.0.0.1:5000/getSearchRecord/"+type+"/"+target;
    var result;
    $.ajax({ 
        url: req_url, 
        type: "GET", 
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        async: false,
        success: function(data) {
            result = data['records'];
        }
    });
    return result;
}

function getRailwayStationsFromCity(city, type){
    var req_url = "http://127.0.0.1:5000/stationsFromCity/" + type;
    var dataJSON = {
        "city":city
    };
    var stations;
    $.ajax({ 
        url:req_url, 
        type: "POST", 
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(dataJSON),
        dataType: "json",
        async: false,
        success: function(data) {
            stations = data['stations'];
        }
    });
    return stations;
}

function getRailwayStationsFromKeyin(keyin, type){
    var req_url = "http://127.0.0.1:5000/stationsFromKeyin/" + type;
    var dataJSON = {
        "keyin":keyin
    };
    var stations;
    $.ajax({ 
        url:req_url, 
        type: "POST", 
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(dataJSON),
        dataType: "json",
        async: false,
        success: function(data) {
            stations = data['stations'];
        }
    });
    return stations;
}
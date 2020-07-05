$(document).ready(function(){

    /*
    查詢選項控制
    */
    // Initial option set
    City = ['桃園市','嘉義縣','彰化縣','嘉義市','新竹市','新竹縣','花蓮縣','宜蘭縣','屏東縣','高雄市','基隆市','金門縣','連江縣','苗栗縣','南投縣','澎湖縣','臺南市','臺北市','新北市','臺東縣','臺中市','雲林縣'];
    addOptions(document.getElementById('tra_hour'),1,12,1);
    addOptions(document.getElementById('tra_min'),0,59,0);
    addOptions(document.getElementById('tra_month'),1,12,1);
    document.getElementById('tra_date').onclick = function(){
        month = document.getElementById('tra_month').value;
        if (month > 12 || month < 1)
            return;
        if (month == 2){
            addOptions(document.getElementById('tra_date'),1,29,1);
        }
        else if (month == 4 || month == 6 || month == 9 || month == 11){
            addOptions(document.getElementById('tra_date'),1,30,1);
        }
        else{
            addOptions(document.getElementById('tra_date'),1,31,1);
        }
    };
    tra_toStation = [];
    tra_fromStation = [];
    time_choice = 0;

    // time choice
    $('.time_choice').hide();
    $('#time_type1').click(function(){
        cur_month = today.getMonth() + 1;
        cur_date = today.getDate();
        time = cur_month + '月' + cur_date +'日 ';
        cur_h = today.getHours();
        cur_m = today.getMinutes();
        if (cur_m < 10)
            cur_m = '0'+cur_m;
        tmp = get12Time(cur_h);
        time+=tmp['ampm']+' '+tmp['hour']+':'+cur_m;
        
        document.getElementById('current_time').innerHTML = time;
        $('#current_time').show();
        $('.time_choice').hide();
        $('#time_type1').css('background','rgb(255, 210, 112)');
        $('#time_type2').css('background','#dacdb6');
        time_choice = 1;
    });
    $('#time_type2').click(function(){
        $('.time_choice').show();
        $('#current_time').hide();
        $('#time_type2').css('background','rgb(255, 210, 112)');
        $('#time_type1').css('background','#dacdb6');
        time_choice = 2;
    });

    // choose today
    var today = new Date();
    month = today.getMonth()+1;
    date = today.getDate();
    if (month == 2){
        addOptions(document.getElementById('tra_date'),1,29,1);
    }
    else if (month == 4 || month == 6 || month == 9 || month == 11){
        addOptions(document.getElementById('tra_date'),1,30,1);
    }
    else{
        addOptions(document.getElementById('tra_date'),1,31,1);
    }

    // First select current time
    document.getElementById('tra_month').options[month-1].selected = true;
    document.getElementById('tra_date').options[date-1].selected = true;
    m = today.getMinutes();
    tmp = get12Time(today.getHours())
    if (tmp['ampm'] == 'AM')
        document.getElementById('tra_am_pm').options[0].selected = true;
    else
        document.getElementById('tra_am_pm').options[1].selected = true;
    document.getElementById('tra_hour').options[tmp['hour']-1].selected = true;
    document.getElementById('tra_min').options[m].selected = true;

    // TRA_from
    // Filter city options from keyin
    $("#tra_from_city").keyup(function(){
        var keyin = document.getElementById('tra_from_city').value;
        var msg = document.getElementById('msg_tra_from_city');
        msg.innerHTML = '';
        if (keyin.length == 0){
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
        $('.submsg').hide();
    });

    // Add station options from city
    $('#tra_from_st').click(function(){
        var city = document.getElementById('tra_from_city').value;
        tra_fromStation = getRailwayStationsFromCity(city, "TRA");
        var msg = document.getElementById('msg_tra_from_st');
        msg.innerHTML = '';
        for (i = 0; i < tra_fromStation.length; i++){
            msg.innerHTML += '<div class="submsg">'+ tra_fromStation[i]['stationName'] +'</div>';
        }
    });

    // Filter station options
    $('#tra_from_st').keyup(function(){
        var keyin = document.getElementById('tra_from_st').value;
        if (keyin.length == 0){
            return;
        }
        var msg = document.getElementById('msg_tra_from_st');
        if (tra_fromStation.length != 0){
            console.log(1)
            msg.innerHTML = '';
            for (i = 0; i < tra_fromStation.length; i++){
                var st = tra_fromStation[i]['stationName'];
                if (st.includes(keyin))
                    msg.innerHTML += '<div class="submsg">'+ st +'</div>';
            }
        }
        else {
            console.log(2)
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
        console.log($('#msg_tra_from_st .submsg').eq(index).text())
        document.getElementById('tra_from_st').value = $('#msg_tra_from_st .submsg').eq(index).text();
        $('.submsg').hide();
    });

    // TRA_to
    // Filter city options from keyin
    $("#tra_to_city").keyup(function(){
        var keyin = document.getElementById('tra_to_city').value;
        var msg = document.getElementById('msg_tra_to_city');
        msg.innerHTML = '';
        if (keyin.length == 0){
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
        $('.submsg').hide();
    });

    // Add station options from city
    $('#tra_to_st').click(function(){
        var city = document.getElementById('tra_to_city').value;
        tra_toStation = getRailwayStationsFromCity(city, "TRA");
        var msg = document.getElementById('msg_tra_to_st');
        msg.innerHTML = '';
        for (i = 0; i < tra_toStation.length; i++){
            msg.innerHTML += '<div class="submsg">'+ tra_toStation[i]['stationName'] +'</div>';
        }
    });

    // Filter station options
    $('#tra_to_st').keyup(function(){
        var keyin = document.getElementById('tra_to_st').value;
        if (keyin.length == 0){
            return;
        }
        var msg = document.getElementById('msg_tra_to_st');
        if (tra_toStation.length != 0){
            console.log(1)
            msg.innerHTML = '';
            for (i = 0; i < tra_toStation.length; i++){
                var st = tra_toStation[i]['stationName'];
                if (st.includes(keyin))
                    msg.innerHTML += '<div class="submsg">'+ st +'</div>';
            }
        }
        else {
            console.log(2)
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
        $('.submsg').hide();
    });

    // THSR
    // Initial set
    addOptions(document.getElementById('thsr_hour'),1,12,1);
    addOptions(document.getElementById('thsr_min'),0,59,0);
    addOptions(document.getElementById('thsr_month'),1,12,1);
    document.getElementById('thsr_date').onclick = function(){
        month = document.getElementById('thsr_month').value;
        if (month > 12 || month < 1)
            return;
        if (month == 2){
            addOptions(document.getElementById('thsr_date'),1,29,1);
        }
        else if (month == 4 || month == 6 || month == 9 || month == 11){
            addOptions(document.getElementById('thsr_date'),1,30,1);
        }
        else{
            addOptions(document.getElementById('thsr_date'),1,31,1);
        }
    };

    // Time choice
    $('.time_choice').hide();
    $('#time_type1').click(function(){
        time = today.getMonth()+1+'月'+today.getDate()+'日 ';
        h = today.getHours();
        m = today.getMinutes();
        if (m < 10)
            m = '0'+m;
        tmp = get12Time(h);
        time+=tmp['ampm']+' '+tmp['hour']+':'+m;
        
        document.getElementById('current_time').innerHTML = time;
        $('#current_time').show();
        $('.time_choice').hide();
        $('#time_type1').css('background','rgb(255, 210, 112)');
        $('#time_type2').css('background','#dacdb6');
    });
    $('#time_type2').click(function(){
        $('.time_choice').show();
        $('#current_time').hide();
        $('#time_type2').css('background','rgb(255, 210, 112)');
        $('#time_type1').css('background','#dacdb6');
    });

    // Choose today
    var today = new Date();
    month = today.getMonth()+1;
    date = today.getDate();
    if (month == 2){
        addOptions(document.getElementById('thsr_date'),1,29,1);
    }
    else if (month == 4 || month == 6 || month == 9 || month == 11){
        addOptions(document.getElementById('thsr_date'),1,30,1);
    }
    else{
        addOptions(document.getElementById('thsr_date'),1,31,1);
    }

    // First select current time
    document.getElementById('thsr_month').options[month-1].selected = true;
    document.getElementById('thsr_date').options[date-1].selected = true;
    m = today.getMinutes();
    tmp = get12Time(today.getHours())
    if (tmp['ampm'] == 'AM')
        document.getElementById('thsr_am_pm').options[0].selected = true;
    else
        document.getElementById('thsr_am_pm').options[1].selected = true;
    document.getElementById('thsr_hour').options[tmp['hour']-1].selected = true;
    document.getElementById('thsr_min').options[m].selected = true;
    var thsr_toStation = [];
    var thsr_fromStation = [];

    // THSR_from
    // Filter city options from keyin
    $("#thsr_from_city").keyup(function(){
        var keyin = document.getElementById('thsr_from_city').value;
        var msg = document.getElementById('msg_thsr_from_city');
        msg.innerHTML = '';
        if (keyin.length == 0){
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
        $('.submsg').hide();
    });

    // Add station options from city
    $('#thsr_from_st').click(function(){
        var city = document.getElementById('thsr_from_city').value;
        thsr_fromStation = getRailwayStationsFromCity(city, "THSR");
        var msg = document.getElementById('msg_thsr_from_st');
        msg.innerHTML = '';
        for (i = 0; i < thsr_fromStation.length; i++){
            msg.innerHTML += '<div class="submsg">'+ thsr_fromStation[i]['stationName'] +'</div>';
        }
    });

    // Filter station options
    $('#thsr_from_st').keyup(function(){
        var keyin = document.getElementById('thsr_from_st').value;
        if (keyin.length == 0){
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
        console.log($('#msg_thsr_from_st .submsg').eq(index).text())
        document.getElementById('thsr_from_st').value = $('#msg_thsr_from_st .submsg').eq(index).text();
        $('.submsg').hide();
    });

    // THSR_to
    // Filter city options from keyin
    $("#thsr_to_city").keyup(function(){
        var keyin = document.getElementById('thsr_to_city').value;
        var msg = document.getElementById('msg_thsr_to_city');
        msg.innerHTML = '';
        if (keyin.length == 0){
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
        $('.submsg').hide();
    });

    // Add station options from city
    $('#thsr_to_st').click(function(){
        var city = document.getElementById('thsr_to_city').value;
        thsr_toStation = getRailwayStationsFromCity(city, "THSR");
        var msg = document.getElementById('msg_thsr_to_st');
        msg.innerHTML = '';
        for (i = 0; i < thsr_toStation.length; i++){
            msg.innerHTML += '<div class="submsg">'+ thsr_toStation[i]['stationName'] +'</div>';
        }
    });

    // Filter station options
    $('#thsr_to_st').keyup(function(){
        var keyin = document.getElementById('thsr_to_st').value;
        if (keyin.length == 0){
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
        $('.submsg').hide();
    });

    /*
     *** 查詢 
    */
    $("#tra_query").click(function(){
        if (time_choice == 0){
            alert('請選擇時間');
            return; 
        }
        var from_st = document.getElementById("tra_from_st").value;
        var to_st = document.getElementById("tra_to_st").value;
        if (from_st.length == 0 || to_st.length == 0) {
            alert('請輸入車站名');
            return;
        }
        var from_city = document.getElementById("tra_from_city").value;
        if (tra_fromStation.length > 0){
            var flag = 0;
            tra_fromStation = getRailwayStationsFromCity(from_city, "TRA");
            for (i = 0; i < tra_fromStation.length; i++){
                if (from_st == tra_fromStation[i]['stationName']){
                    flag = 1;
                    break;
                }
            }
            if (flag != 1){
                alert("縣市與站名不相符")
                return;
            }
        }
        var to_city = document.getElementById("tra_from_city").value;
        if (tra_toStation.length > 0){
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
        if (time_choice == 2) {
            var hour = get24Time(document.getElementById("tra_hour").value,document.getElementById("tra_am_pm").value);
            var min = document.getElementById("tra_min").value;
            var month = document.getElementById("tra_month").value;
            var date = document.getElementById("tra_date").value;
        }
        else {
            var hour = cur_h;
            var min = cur_m;
            var month = cur_month;
            var date = cur_date;
        }
        console.log(hour);
        getRailwayResult(from_st, to_st, month, date, hour, min, "TRA");
    });

});

function addOptions(target, startNum, endNum, op){
    if (startNum > endNum)
        return;
    ops = '';
    for (i=startNum; i<=endNum; i++){
        if(op == 1 || i >= 10){
            ops += "<option value='"+i+"'>"+i+"</option>";
        }
        else if (i < 10){
            ops += "<option value='"+i+"'>0"+i+"</option>";
        }
    }
    target.innerHTML = ops;
}

function get12Time(h){
    var ampm;
    var hour;
    if (h > 11)
        ampm = "PM";
    else
        ampm = "AM";

    if (h == 0)
        hour = 12;
    else if (h > 12){
        hour = (h-12);
    }
    else{
        hour = h;
    }
    return {'ampm':ampm,'hour':hour};
}

function get24Time(h, ampm){
    var return_h;
    if (ampm == "AM"){
        if (h == 12){
            return_h = 0;
        }
        else {
            return_h = h;
        }
    }
    else {
        if (h == 12) {
            return_h = 12;
        }
        else {
            return_h = h + 12;
        }
    }
    return return_h;
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

// 寫這個
function getRailwayResult(from_station, to_station, month, date, hour, min, type){
    var req_url = "http://127.0.0.1:5000/RailwayResult/" + type;
    var dataJSON = {
        "from_station":from_station,
        "to_station":to_station,
        "month":month,
        "date":date,
        "hour":hour,
        "min":min
    };
    $.ajax({ 
        url:req_url, 
        type: "POST", 
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(dataJSON),
        dataType: "json",
        async: false,
        success: function(data) {

        }
    });
}

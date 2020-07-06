$(document).ready(function(){

    /*
    查詢選項控制
    */
    // Initial option set
    City = ['桃園市','嘉義縣','彰化縣','嘉義市','新竹市','新竹縣','花蓮縣','宜蘭縣','屏東縣','高雄市','基隆市','金門縣','連江縣','苗栗縣','南投縣','澎湖縣','臺南市','臺北市','新北市','臺東縣','臺中市','雲林縣'];
    
    /*
    **** Bus
    */
    // bus time choice
    $('#bus_time_type1').click(function(){
        cur_month = today.getMonth() + 1;
        cur_date = today.getDate();
        time = cur_month + '月' + cur_date +'日 ';
        cur_h = today.getHours();
        cur_m = today.getMinutes();
        if (cur_m < 10)
            cur_m = '0'+cur_m;
        tmp = get12Time(cur_h);
        time+=tmp['ampm']+' '+tmp['hour']+':'+cur_m;
        $('article .current_time').eq(0).text(time);
        $('article .current_time').eq(0).show();
        $('article .time_choice').eq(0).hide();
        $('#bus_time_type1').css('background','rgb(255, 210, 112)');
        time_choice = 1;
    });

    // Filter city options from keyin
    $("#bus_city").keyup(function(){
        var keyin = document.getElementById('bus_city').value;
        var msg = document.getElementById('msg_bus_city');
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
    $("#msg_bus_city").on('click','.submsg',function(){
        var index = $(this).index();
        document.getElementById('bus_city').value = $('#msg_bus_city .submsg').eq(index).text();
        $('.submsg').hide();
    });

    // Add station options from city
    $('#bus_route').click(function(){
        var city = document.getElementById('bus_city').value;
        bus_route = getBusRouteFromCity(city);
        var msg = document.getElementById('msg_bus_route');
        msg.innerHTML = '';
        for (i = 0; i < bus_route.length; i++){
            msg.innerHTML += '<div class="submsg">'+ bus_route[i]['route'] +'</div>';
        }
        $("#msg_bus_route .submsg").hide();
        for (i = 0; i < 8; i++) {
            $("#msg_bus_route .submsg").eq(i).css('display','inline-block');
        }
    });

    // Filter station options
    $('#bus_route').keyup(function(){
        var keyin = document.getElementById('bus_route').value;
        if (keyin.length == 0){
            return;
        }
        var msg = document.getElementById('msg_bus_route');
        if (bus_route.length != 0){
            msg.innerHTML = '';
            for (i = 0; i < bus_route.length; i++){
                var st = bus_route[i]['route'];
                if (st.includes(keyin))
                    msg.innerHTML += '<div class="submsg">'+ st +'</div>';
            }
            $("#msg_bus_route .submsg").hide();
            for (i = 0; i < 8; i++) {
                $("#msg_bus_route .submsg").eq(i).css('display','inline-block');
            }
        }
        else {
            var routes = getBusRouteFromCity(city);
            msg.innerHTML = '';
            for (i = 0; i < routes.length; i++){
                msg.innerHTML += '<div class="submsg">'+ routes[i]['route'] +'</div>';
            }
            $("#msg_bus_route .submsg").hide();
            for (i = 0; i < 8; i++) {
                $("#msg_bus_route .submsg").eq(i).css('display','inline-block');
            }
        }
    });    

    // If one of the options is selected, hide options
    $("#msg_bus_route").on('click','.submsg',function(){
        var index = $(this).index();
        document.getElementById('bus_route').value = $('#msg_bus_route .submsg').eq(index).text();
        $('.submsg').hide();
    });

    /*
    **** TRA
    */
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
    $(".results h3").css('opacity','0');
    $(".results .result").css('opacity','0');

    // time choice
    $('.time_choice').hide();

    

    // TRA time choice
    $('#tra_time_type1').click(function(){
        cur_month = today.getMonth() + 1;
        cur_date = today.getDate();
        time = cur_month + '月' + cur_date +'日 ';
        cur_h = today.getHours();
        cur_m = today.getMinutes();
        if (cur_m < 10)
            cur_m = '0'+cur_m;
        tmp = get12Time(cur_h);
        time+=tmp['ampm']+' '+tmp['hour']+':'+cur_m;
        
        $('article .current_time').eq(1).text(time);
        $('article .current_time').eq(1).show();
        $('article .time_choice').eq(1).hide();
        $('#tra_time_type1').css('background','rgb(255, 210, 112)');
        $('#tra_time_type2').css('background','#dacdb6');
        time_choice = 1;
    });
    $('#tra_time_type2').click(function(){
        $('article .time_choice').eq(1).show();
        $('article .current_time').eq(1).hide();
        $('#tra_time_type2').css('background','rgb(255, 210, 112)');
        $('#tra_time_type1').css('background','#dacdb6');
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

    /*
    **** THSR
    */
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

    
    // THSR time choice
    $('#thsr_time_type1').click(function(){
        cur_month = today.getMonth() + 1;
        cur_date = today.getDate();
        time = cur_month + '月' + cur_date +'日 ';
        cur_h = today.getHours();
        cur_m = today.getMinutes();
        if (cur_m < 10)
            cur_m = '0'+cur_m;
        tmp = get12Time(cur_h);
        time+=tmp['ampm']+' '+tmp['hour']+':'+cur_m;
        $('article .current_time').eq(2).text(time);
        $('article .current_time').eq(2).show();
        $('article .time_choice').eq(2).hide();
        $('#thsr_time_type1').css('background','rgb(255, 210, 112)');
        $('#thsr_time_type2').css('background','#dacdb6');
        time_choice = 1;
    });
    $('#thsr_time_type2').click(function(){
        $('article .time_choice').eq(2).show();
        $('article .current_time').eq(2).hide();
        $('#thsr_time_type2').css('background','rgb(255, 210, 112)');
        $('#thsr_time_type1').css('background','#dacdb6');
        time_choice = 2;
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
        var result = getRailwayResult(from_st, to_st, month, date, hour, min, "TRA");
        if (result['status'] == 1){
            alert('無效車站名');
            return;
        }
        else if (result['status'] == 2) {
            alert('查無班次')
            return;
        }
        $(".results h3").eq(1).css('opacity','1');
        var trains = result['trains'];
        var r1 = '',r2 = '', r3 = '', r4 = '', r5 = '';
        for (i = 0; i < trains.length; i++) {
            r1 += '<li>'+ trains[i]['TrainNo'] +'</li>';
            r2 += '<li>'+ trains[i]['TrainTypeName'] +'</li>';
            r3 += '<li>'+ trains[i]['DepartureTime'] +'</li>';
            r4 += '<li>'+ trains[i]['ArrivalTime'] +'</li>';
            r5 += '<li>'+ trains[i]['Duration'] +'</li>';
        }
        $("#tra_result nav ul").eq(0).html(r1);
        $("#tra_result nav ul").eq(1).html(r2);
        $("#tra_result nav ul").eq(2).html(r3);
        $("#tra_result nav ul").eq(3).html(r4);
        $("#tra_result nav ul").eq(4).html(r5);
        $(".results .result").eq(1).css('opacity','1');
    });

    
    $("#thsr_query").click(function(){
        if (time_choice == 0){
            alert('請選擇時間');
            return; 
        }
        var from_st = document.getElementById("thsr_from_st").value;
        var to_st = document.getElementById("thsr_to_st").value;
        if (from_st.length == 0 || to_st.length == 0) {
            alert('請輸入車站名');
            return;
        }
        var from_city = document.getElementById("thsr_from_city").value;
        if (thsr_fromStation.length > 0){
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
        var to_city = document.getElementById("thsr_from_city").value;
        if (thsr_toStation.length > 0){
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
        if (time_choice == 2) {
            var hour = get24Time(document.getElementById("thsr_hour").value,document.getElementById("thsr_am_pm").value);
            var min = document.getElementById("thsr_min").value;
            var month = document.getElementById("thsr_month").value;
            var date = document.getElementById("thsr_date").value;
        }
        else {
            var hour = cur_h;
            var min = cur_m;
            var month = cur_month;
            var date = cur_date;
        }
        var result = getRailwayResult(from_st, to_st, month, date, hour, min, "THSR");
        if (result['status'] == 1){
            alert('無效車站名');
            return;
        }
        else if (result['status'] == 2) {
            alert('查無班次')
            return;
        }
        $(".results h3").eq(2).css('opacity','1');
        var trains = result['trains'];
        console.log(trains);
        var r1 = '',r2 = '', r3 = '';
        for (i = 0; i < trains.length; i++) {
            r1 += '<li>'+ trains[i]['TrainNo'] +'</li>';
            r2 += '<li>'+ trains[i]['DepartureTime'] +'</li>';
            r3 += '<li>'+ trains[i]['ArrivalTime'] +'</li>';
        }
        $("#thsr_result nav ul").eq(0).html(r1);
        $("#thsr_result nav ul").eq(1).html(r2);
        $("#thsr_result nav ul").eq(2).html(r3);
        $(".results .result").eq(2).css('opacity','1');
    });

    $("#bus_query").click(function(){
        var hour = cur_h;
        var min = cur_m;
        var city = document.getElementById('bus_city').value;
        var routeName = document.getElementById('bus_route').value;
        var result = getBusResult(routeName, city, hour, min);
        
    })
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

function getBusRouteFromCity(city){
    var req_url = "http://127.0.0.1:5000/busRouteFromCity";
    var dataJSON = {
        "city":city
    };
    var routes;
    $.ajax({ 
        url:req_url, 
        type: "POST", 
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(dataJSON),
        dataType: "json",
        async: false,
        success: function(data) {
            routes = data['routes'];
        }
    });
    return routes;
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

function getBusResult(routeName, city, hour, min){
    var req_url = "http://127.0.0.1:5000/BusResult";
    var result;
    var dataJSON = {
        "routeName":routeName,
        "city":city,
        "month":month,
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
            result = data;
        }
    });
    return result;
}

function getRailwayResult(from_station, to_station, month, date, hour, min, type){
    var req_url = "http://127.0.0.1:5000/RailwayResult/" + type;
    var result;
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
            result = data;
        }
    });
    return result;
}

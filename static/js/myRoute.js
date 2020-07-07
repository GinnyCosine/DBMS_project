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


});

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
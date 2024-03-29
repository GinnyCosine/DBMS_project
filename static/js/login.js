$(document).ready(function(){
    $("form").hide();

    // login
    document.getElementById("sub2").onclick = function(){
        var user = document.getElementById('user').value;
        var enterPwd = document.getElementById('pwd').value;
        var status = userLogin(user, enterPwd);
        if (status == 3){
            if (document.referrer == 'http://127.0.0.1:5000/myRoute'){
                window.location.href = "http://127.0.0.1:5000/myRoute";
                return;
            }
            window.location.href = "http://127.0.0.1:5000/publicTransportation";
        }
        else if (status == 2)
            alert('Wroung password');
        else if (status == 1)
            alert('User does not exist');
    }

    // create account
    document.getElementById("sub1").onclick = function(){
        var user = document.getElementById('c_user').value;
        var enterPwd = document.getElementById('c_pwd').value;
        var enterPwd_2 = document.getElementById('c_pwd_confirm').value;
        if (user.length > 8) {
            alert('Username longer than 8 words');
            return;
        }
        if (enterPwd != enterPwd_2){
            alert('Different password');
            return;
        }
        if (enterPwd.length > 8) {
            alert('Password longer than 8 words');
            return;
        }
        for (i = 0; i < enterPwd.length; i++){
            if(!((enterPwd[i].charCodeAt()>=65 &&enterPwd[i].charCodeAt()<=90)||
                (enterPwd[i].charCodeAt()>=97 &&enterPwd[i].charCodeAt()<=122)||
                (enterPwd[i].charCodeAt()>=48 &&enterPwd[i].charCodeAt()<=57))){
                alert('Password can only contain English words and number');
                return;
            }
        }
        status = createUser(user,enterPwd);
        if(status == 'fail'){
            alert('Username has been used');
        }
        else{
            alert('Create account success. Please login again');
        }
    }

    $("#c_user").keyup(function(){
        var user = document.getElementById('c_user').value;
        var msg = document.getElementById('c_user_msg');
        if (user.length > 8){
            msg.innerHTML = 'Longer than 8 words';
            $('#c_user_msg').css("color","red");
        }
        else{
            msg.innerHTML = 'Upper limit 8 words';
            $('#c_user_msg').css("color","black");
        }
    });

    $("#c_user").click(function(){
        var user = document.getElementById('c_user').value;
        var msg = document.getElementById('c_user_msg');
        if (user.length > 8){
            msg.innerHTML = 'Longer than 8 words';
            $('#c_user_msg').css("color","red");
        }
        else{
            msg.innerHTML = 'Upper limit 8 words';
            $('#c_user_msg').css("color","black");
        }
    });

    // detect input
    $("#c_pwd").keyup(function(){
        var enterPwd = document.getElementById('c_pwd').value;
        var pwd_msg = document.getElementById('c_pwd_msg');
        var len = enterPwd.length;
        if (len > 8){
            pwd_msg.innerHTML = 'Longer than 8 words';
            $('#c_pwd_msg').css("color","red");
            return;
        }
        for (i = 0; i < enterPwd.length; i++){
            if(!((enterPwd[i].charCodeAt()>=65 &&enterPwd[i].charCodeAt()<=90)||(enterPwd[i].charCodeAt()>=97 &&enterPwd[i].charCodeAt()<=122)||(enterPwd[i].charCodeAt()>=48 &&enterPwd[i].charCodeAt()<=57))){
                pwd_msg.innerHTML = 'Only English words and number';
                $('#c_pwd_msg').css("color","red");
                return;
            }
        }
        pwd_msg.innerHTML = 'Upper limit 8 words';
        $('#c_pwd_msg').css("color","black");
    });

    $("#c_pwd_confirm").keyup(function(){
        var enterPwd = document.getElementById('c_pwd').value;
        var enterPwd_2 = document.getElementById('c_pwd_confirm').value;
        var pwd_confirm_msg = document.getElementById('c_pwd_confirm_msg');
        if (enterPwd != enterPwd_2){
            pwd_confirm_msg.innerHTML = 'Different from the password above';
            $('#c_pwd_confirm_msg').css("color","red");
        }
        else{
            pwd_confirm_msg.innerHTML = 'OK';
            $('#c_pwd_confirm_msg').css("color","green");
        }
    });

    // change login type
    document.getElementById("b_type1").onclick = function(){
        $("form").eq(0).show();
        $("form").eq(1).hide();
        $("#b_type1").css("background","#ffd270");
        $("#b_type2").css("background","#dacdb6");
    };
    document.getElementById("b_type2").onclick = function(){
        $("form").eq(1).show();
        $("form").eq(0).hide();
        $("#b_type2").css("background","#ffd270");
        $("#b_type1").css("background","#dacdb6");
    };

});

function userLogin(user, pwd){
    var req_url = "http://127.0.0.1:5000/login";
    var status;
    var dataJSON = {
        "user":user,
        "pwd": pwd
    };
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

function createUser(user,pwd){
    var req_url = "http://127.0.0.1:5000/create_user";
    var dataJSON = {
        "user":user,
        "pwd": pwd
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

function goToPage(page){
    $.ajax({ 
        url: "http://127.0.0.1:5000/" + page, 
        type: "GET", 
        dataType: "json",
        async: false,
        success: function(data) {
            
        }
    });
}
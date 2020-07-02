$(document).ready(function(){
    $("form").hide();
    var user;
    var pwd;

    document.getElementById("try").onclick = function(){
        var req_url = "http://127.0.0.1:5000/user";
        $.ajax({ 
            url:req_url, 
            type: "GET", 
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            success: function(data) {
                console.log(data);
            }
        });
    }
    
    document.getElementById("b_type1").onclick = function(){
        $("form").eq(0).show();
        $("form").eq(1).hide();
    };

    document.getElementById("b_type2").onclick = function(){
        $("form").eq(1).show();
        $("form").eq(0).hide();
    };

});


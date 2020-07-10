$(document).ready(function(){
    result = getTrain(location.href);
    document.getElementById("trainNo").innerHTML = result['TrainNo'];
    text = '<div class="block">車站</div><div class="block">時間</div><br>';
    for (i = 0; i < result['stations'].length; i++) {
        text += '<div class="block">'+result['stations'][i][0]+'</div>';
        if (result['stations'][i][2] < 10)
            var m = '0'+result['stations'][i][2];
        else
            var m = result['stations'][i][2];
        text += '<div class="block">'+result['stations'][i][1]+':'+m+'</div></br>';
    }
    document.getElementById("trains").innerHTML = text;
})

function getTrain(url){
    var req_url = "http://127.0.0.1:5000/getTrain";
    var dataJSON = {
        "url": url
    };
    var result;
    $.ajax({ 
        url: req_url, 
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
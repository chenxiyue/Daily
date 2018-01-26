$(function () {
    setGreetings();  //设置问候语

    /*发送请求，根据是否登录切换头部样式*/
    $.ajax({
        type: "POST",
        url: "/islogin",
        dataType: "json",
        success: function (data) {
            if (data && data.text == "existCookie") {
                $("#btnBox").css("display", "none");
                $("#btnBox_logined").css("display", "block");
                $("#username").text(data.username + "！");
            } else if (data == "noCookie") {
                $("#btnBox").css("display", "block");
                $("#btnBox_logined").css("display", "none");
            }
        }
    });

    /*设置登录区域问候语*/
    function setGreetings() {
        var date = new Date();
        var hour = date.getHours();
        var greeting = "";

        if (hour < 8) {
            greeting = "早上好，";
        } else if (hour >= 8 && hour < 12) {
            greeting = "上午好，";
        } else if (hour >= 12 && hour < 13) {
            greeting = "中午好，";
        } else if (hour >= 13 && hour < 19) {
            greeting = "下午好，";
        } else if (hour >= 19) {
            greeting = "晚上好，";
        }

        $("#greetings").text(greeting);
    }
});
$(function () {
    var E = window.wangEditor;
    var editor = new E('#editor');
    editor.create();

    setGreetings(); //设置问候语

    $("#btnBox_logined").css("display", "block");

    $("#article_topic").change(function () {
        if ($(this).val() == "") {
            $("#article_topic").css("border", "1px solid #f82000");
            $("#topic_wrong").text("标题不能为空！");
        } else {
            $("#article_topic").css("border", "");
            $("#topic_wrong").text("");
        }
    });

    $("#publish").on("click", function () {
        var topic = $("#article_topic").val();
        var content = editor.txt.text();

        if (topic == "") {
            $("#article_topic").css("border", "1px solid #f82000");
            $("#topic_wrong").text("标题不能为空！");
        } else if (content == "") {
            $("#content_wrong").text("内容不能少于100个字！");
        } else {
            $.ajax({
                type: "POST",
                url: "/article/new",
                data: {
                    data_topic: topic,
                    data_content: content
                },
                success: function (data) {
                    if (data == "success") {
                        location.href = "/";
                    }
                }
            });
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
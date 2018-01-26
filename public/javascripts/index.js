$(function () {
    var imgIndex = 1; //用于轮播图顺序
    var scrollTimer = null;  //自动轮播图定时器

    setGreetings(); //设置问候语
    autoScroll();  //图片自动轮播
    
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

    /*页面加载完后给每个用户名、签名、推荐文章标题添加title*/
    $(".authors_name").each(function () {
        $(this).attr("title", $(this).text());
    });

    $(".authors_sign").each(function () {
        $(this).attr("title", $(this).text());
    });

    $(".recommended_topic").each(function () {
        $(this).attr("title", $(this).text());
    });

    /*点击主页登录和注册时弹出相应的界面*/
   $(".btnBox").on("click", function (event) {
       event_stop(event);
       var target = eventUtil.getElement(event);

       $(".cover").addClass(" is-visible");
       $(".loginBox").addClass(" is-visible");

       if ($(target).is("#login")) {
           login_selected();
       } else {
           register_selected();
       }
   });

   /*点击遮罩关闭登录注册界面*/
   $(".cover").on("click", function (event) {
       event_stop(event);
       var target = eventUtil.getElement(event);

       if ($(target).is(".cover")) {
           close_cover();
       }
   });

   /*切换表单*/
   $(".loginBox_row1").on("click", function (event) {
       event_stop(event);
       var target = eventUtil.getElement(event);

        if ($(target).is(".loginBox_row1 .loginText")) {
            login_selected();
        } else if ($(target).is(".loginBox_row1 .registerText")) {
            register_selected();
        }
   });

   /*选择登录*/
    function login_selected() {
        $("#login_form").addClass("is-selected");
        $("#register_form").removeClass("is-selected");
        $(".loginText").addClass(" selected");
        $(".registerText").removeClass(" selected");
    }

    /*选择注册*/
    function register_selected() {
        $("#login_form").removeClass("is-selected");
        $("#register_form").addClass("is-selected");
        $(".loginText").removeClass(" selected");
        $(".registerText").addClass(" selected");
    }

    /*关闭所有*/
    function close_cover() {
        $(".cover").removeClass(" is-visible");
        $(".loginBox").removeClass(" is-visible");
        $("#login_form").removeClass("is-selected");
        $("#register_form").removeClass("is-selected");
        $(".loginText").removeClass(" selected");
        $(".registerText").removeClass(" selected");
    }

    /*滚动事件*/
    $(".main .content .newsScroll .scroll-box .scroll-btn").find("span").each(function () {
        $(this).on("click", function (event) {
            if ($(this).hasClass("on")) {
                return;
            }
            event_stop(event);
            var target = eventUtil.getElement(event);

            var nowIndex = parseInt($(target).attr("index"));
            var offset = (nowIndex - imgIndex) * (-600);
            imgIndex = nowIndex;
            imgSwitch(offset);
            showButton();
        });
    });

    /*鼠标放在轮播图区域时显示按钮*/
    $(".main .content .newsScroll .scroll-box").hover(function () {
        clearTimeout(scrollTimer);
        $(this).find(".scroll-btn").eq(0).fadeIn(500);
    }, function () {
        $(this).find(".scroll-btn").eq(0).fadeOut(500);
        autoScroll();
    });
    
    /*滚动图片切换和显示当前按钮颜色*/
    function imgSwitch(offset) {
        var scroll_img = $(".main .content .newsScroll .scroll-box .scroll-img");
        var left = parseInt(scroll_img.css("left")) + offset;

        if (left < -1200) {
            left = 0;
        }

        scroll_img.animate({"left": left}, 300, function () {
            scroll_img.css("left", left + "px");
        });
    }

    function showButton() {
        var scroll_btn = $(".main .content .newsScroll .scroll-box .scroll-btn").find("span");
        scroll_btn.each(function () {
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
                return false;
            }
        });
        scroll_btn[imgIndex-1].className = "on";
    }
    
    function autoScroll() {
        scrollTimer = setTimeout(function () {
            if (imgIndex == 3) {
                imgIndex = 1;
            } else {
                imgIndex += 1;
            }

            imgSwitch(-600);
            showButton();
            autoScroll();
        }, 5000);
    }

    /*监听登录按钮*/
    $("#login_btn").on("click", function (event) {
        $.ajax({
            type: "POST",
            url: "/login",
            data: {
                username: $("#loginUserText").val(),
                password: $("#loginPSWText").val()
            },
            success: function (data) {
                if (data == "success") {
                    location.href = "/";
                } else if (data == "wronguser") {
                    $("#wrongUser").text("用户名不存在");
                    return false;
                } else if (data == "wrongpsw") {
                    $("#wrongPSW").text("密码不正确");
                    return false;
                }
            }
        });
    });

    /*监听注册按钮*/
    $("#register_btn").on("click", function (event) {
        if ($("#confirmpassword").val() != $("#passwordText").val()) {
            event.preventDefault();
            $("#diffPassword").text("密码不一致");
        } else {
            $("#diffPassword").text("");
            $.ajax({
                type: "POST",
                url: "/register",
                data: {
                    username: $("#usernameText").val(),
                    password: $("#passwordText").val()
                },
                success: function (data) {
                    if (data == "success") {
                        location.href = "/";
                    } else if (data == "existed") {
                        $("#errorUsername").text("用户名已存在");
                        return false;
                    }
                }
            });
        }
    });

    /*监听创建笔记按钮*/
    $("#createNote").on("click", function (event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/article',
            success: function (data) {
               if (data == 'unlogined') {
                   $(".cover").addClass(" is-visible");
                   $(".loginBox").addClass(" is-visible");
                   login_selected();
               } else if (data == 'logined') {
                   location.href = "/article";
               }
            }
        });
    });

    /*登录注册区域的input获得焦点和失去焦点时的事件*/
    $(".l_input").focus(function () {
        $(this).css({"border": "1px solid #6fd4f8", "box-shadow": "0px 0px 5px rgba(111, 212, 248, 0.75)"});
        $(".loginBox_row2 .reminder").text("");
    });

    $(".l_input").blur(function () {
        $(this).css({"border": "", "box-shadow": ""});
    });

    /*阻止事件冒泡和默认行为*/
    var eventUtil = {
        getElement: function (event) {
            return event.target || event.srcElement;
        }
    };

    function event_stop(event) {
        event = event || window.event;

        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
});
$(function () {

    var userInput = null;
    var window_focus = true;
    var notificationStack = new Array;
    var socket = io();

    var titleInterval;

    function sayWelcome() {
        var welcomeMessage = new Message({
            text: "Welcome " + userInput,
            message_side: "info",
            user: userInput,
            date: getCurrentTime()
        });
        welcomeMessage.draw();
    }

    function clearMessages() {
        $(".messages").empty();
    }

    $('.send_message').click(function (e) {
        var messageText = getMessageText();
        if (messageText) {
            var message = {
                user: userInput,
                msg: messageText,
            };
            socket.emit('chat', message);
            clearMessageText();
        }
        return false;
    });

    $('.message_input').keyup(function (e) {
        if (e.which === 13) {

            var msg = getMessageText();
            if (!msg)
                return;

            var message = {
                user: userInput,
                msg: msg,
            };

            // message.msg = emejiConverter(message.msg);
            socket.emit('chat', message);
            clearMessageText();
        }
    });

    socket.on('chat', function (message) {
        var side = "right";
        if (message.user != userInput) {
            side = "left"
            notifyUser(message);
        }

        var mes = new Message({
            text: replaceURLWithHTMLLinks(message.msg),
            message_side: side,
            user: message.user,
            date: message.date,
            image: message.image
        });

        mes.draw();
        scroll();
    });

    socket.on('connected', function (username) {
        if (username == userInput)
            return;

        var info = new Message({
            text: username + " connected",
            message_side: "info"
        });
        info.draw();
        scroll();

        var user = SingleUser({
            username: username,
            logindate: getCurrentTime(),
        });
        user.addOnlineUserTable();

    });

    socket.on('disconnected', function (username) {
        if (username == userInput)
            return;

        var info = new Message({
            text: username + " disconnected",
            message_side: "info"
        });

        info.draw();
        scroll();

        var user = SingleUser({ username: username });
        user.removeFromUserTable();
    });

    socket.on('error', function (err) {
        //alert(err.message);
    });

    function scroll() {
        $messages = $('.messages');
        $messages.animate({
            scrollTop: $messages.prop('scrollHeight')
        }, 300);
    }

    function notifyUser(message) {

        if (!Settings.notificatioSupported || window_focus) return;

        //if (window_focus) return;

        clearInterval(titleInterval);
        titleInterval = setInterval(function () {
            toggleTitle()
        }, 500);

        if (!Settings.showNotifications) return;

        if (!Notification) {
            return;
        }

        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            var notification = new Notification(Settings.appName + ' - ' + message.user, {
                icon: 'https://raw.githubusercontent.com/agtokty/netcet/master/public/images/netcetlogo.PNG',
                body: message.date + " " + message.msg,
            });

            notification.onclick = function () {
                window.focus();
                notification.close();
                clearAllNotifications();
            };
            notificationStack.push(notification);
        }
    }

    function getOnlineUsers() {
        var url = getCurrentHost() + "/api/users";
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                if (data && data.length > 0) {
                    $("#onlineUserListTableBody").empty();
                    for (var i = 0; i < data.length; i++) {
                        var user = SingleUser({
                            username: data[i].username,
                            logindate: getCurrentTime(data[i].connectedAt, true),
                        });
                        user.addOnlineUserTable();
                    }
                } else {

                }
                //console.log(data);
            },
            error: function (data) {
                console.log(data);
            }
        });
    }

    function toggleTitle() {
        if (document.title == Settings.title)
            document.title = Settings.newMessageAlert;
        else
            document.title = Settings.title;
    }

    function clearAllNotifications() {
        if (notificationStack.length > 0) {
            for (var i = 0; i < notificationStack.length; i++)
                notificationStack[i].close();
            notificationStack = new Array();
        }

        clearInterval(titleInterval);
        document.title = Settings.title
    }

    var getMessageText = function () {
        var $message_input;
        $message_input = $('.message_input').val();
        return $message_input.trim();
    };

    var clearMessageText = function () {
        var $message_input = $('.message_input');
        return $message_input.val("");
    };

    var resizeMessages = function () {
        $(".messages").height($(window).height() - ($(".top_menu").height() + $(".bottom_wrapper").height() + 90));

        $("#login-modal-content").height($(window).height());
        $("#login-modal-body").height($(window).height() - (94));
        //$("#login-modal-body").height($(window).height() );
    }

    socket.disconnect();

    window.onresize = function (event) {
        resizeMessages()
    };

    document.title = Settings.title;

    window.onblur = function () {
        window_focus = false;
    }

    window.onfocus = function () {
        window_focus = true;
        clearAllNotifications();
    }

    window.onbeforeunload = function () {
        socket.emit('disconnected', { reason: "closed browser" });
    }

    var cusername = getCookie(COOKIE_NAME_USERNAME, null);
    if (cusername == null) {
        $('#loginModol').modal('show');

        var enterLogin = function () {
            var username = $("#username").val() && $("#username").val().trim();
            if (username) {
                setCookie(COOKIE_NAME_USERNAME, username, 7);
                $('#loginModol').modal('hide');
                socket.connect();
                socket.emit('connected', username);
                userInput = username;
                sayWelcome();
            } else {
                console.log("enter valid username");
            }
        }

        $('body').on("keyup",'#username', function(e){
            if (e.which === 13) {
                enterLogin();
            }
        });

        $('body').on("click", "#btnLogin", function(){
            enterLogin();
        });

    } else {
        userInput = cusername;
        if (Notification.permission !== "granted")
            Notification.requestPermission();
        socket.connect();
        sayWelcome();
        socket.emit('connected', userInput);
    }


    $("#btnSettings").on("click", function () {
        $('#myModal').modal('show');
    });

    $("#whoisonline").on("click", function () {
        $('#onlineUsersModol').modal('show');
        getOnlineUsers();
    });

    $("#btnSupEmoji").on("click", function () {
        var html = "";
        for (var i = 0; i < emejiList.length; i++) {
            html = html + "<div class='col-md-2 col-xs-4 emojibox' >" + emejiList[i].val + " - " + emejiList[i].key + "</div>";
        }
        $("#emojiList").html(html);
        $('#btnSupEmojiModol').modal('show');
    });

    $("#btnLogoutConfirm").on("click", function () {
        socket.emit('disconnected', { reason: "logout" });
        socket.disconnect();
        deleteCookie(COOKIE_NAME_USERNAME);
        deleteCookie(COOKIE_SHOW_NOTIFICATION);
        userInput = null;
        $('#loginModol').modal('show');
        clearMessages();
    });

    $("#btnLogout").on("click", function () {

        $('#exitModol').modal('show');

    });

    $('#showNotification').change(function () {
        console.log($(this).prop('checked'));
        Settings.showNotifications = $(this).prop('checked');
        setCookie(COOKIE_SHOW_NOTIFICATION, Settings.showNotifications);
    });

    resizeMessages();

    /*file upload*/
    $('#imagefile').bind('change', function (e) {
        var data = e.originalEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            // image('me', evt.target.result);
            if (evt.target && evt.target.result) {
                $("#btnSendConfirm").prop('disabled', false);
                $("#image-preview").attr('src', evt.target.result);
            }
        };
        reader.readAsDataURL(data);
    });

    $('#image-url').bind('change', function (e) {

        if (e.target.value && checkURL(e.target.value)) {
            $("#btnSendConfirm").prop('disabled', false);
            $("#image-preview").attr('src', e.target.value);
        }

    });

    $("#btnSendConfirm").on("click", function () {

        var message = {
            user: userInput,
            msg: "",
        };

        var image_src = $('#image-preview').attr('src');

        if (image_src) {

            message.image = image_src;

            socket.emit('chat', message);

            $('#image-preview').attr('src', '');
            $('#image-url').val('');
            $('#imagefile').val('');
            $("#btnSendConfirm").prop('disabled', true);

        }

        $("#uploadModol").modal("hide")
        //TODO - yükleniyor spini
    });

    socket.on('image', function (imageMesage) {

        console.log(imageMesage);
        //$('#lines').append($('<p>').append($('<b>').text(from), '<img src="' + base64Image + '"/>'));

    });

});
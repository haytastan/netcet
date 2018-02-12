var Message;
Message = function (arg) {
    this.user = arg.user;
    this.date = arg.date;
    this.text = arg.text;
    this.image = arg.image;
    this.message_side = arg.message_side;
    this.draw = function (_this) {
        return function () {


            var $message;
            if (this.message_side == "info")
                $message = $($('.info_message_template').clone().html());
            else
                $message = $($('.message_template').clone().html());

            if (this.image) {
                $message = $($('.message_template_image').clone().html());

                //$('#lines').append($('<p>').append($('<b>').text(from), ));
                $message.find('.message_image').html('<img src="' + this.image + '"/>')
            }

            $message.find('.message_time').html(getCurrentTime(null, false));
            $message.addClass(_this.message_side).find('.text').html(_this.text);
            var letter = "...";
            if (this.user) {
                letter = this.user.substring(0, 2).toUpperCase();

                $username_first_letter = $message.find('.username_first_letter');
                $username_first_letter.html(letter);

                $avatar = $message.find('.avatar');
                $avatar.attr("title", this.user);
            }

            $('.messages').append($message);
            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);

        };
    }(this);
    return this;
};

var SingleUser;
SingleUser = function (arg) {
    this.username = arg.username;
    this.logindate = arg.logindate;
    this.color = arg.color;
    this.addOnlineUserTable = function (_this) {
        return function () {

            var $row = $("<tr>", { "class": "a", "username": _this.username });
            var $tdusername = $("<td>", { "class": "a" }).html('<span class="user-subhead">' + _this.username + '</span>');
            var $tdlogindate = $("<td>", { "class": "user-logindate" }).text(_this.logindate);
            var $tdstatus = $("<td>", { "class": "text-center" }).html('<span class="label label-success">online</span>');

            $row.append($tdusername);
            $row.append($tdlogindate);
            $row.append($tdstatus);

            var letter = "...";
            if (this.username) {
                letter = this.username.charAt(0).toUpperCase()
            }

            $('#onlineUserListTableBody').append($row);

        };
    }(this);
    this.removeFromUserTable = function (_this) {
        return function () {
            $("#onlineUserListTableBody").find("[username='" + _this.username + "']").remove();
            //console.log("remove : " + _this.username);
        };
    }(this);
    return this;
};
function getCurrentTime(time, withAgo) {
    var d = new Date();
    if (time)
        d = new Date(time);
    var h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    var s = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();


    var ago = "";
    if (timeago && withAgo) {
        var timeagoInstance = timeago();
        ago = " ( " + timeagoInstance.format(d) + " )"
    }

    return h + ":" + m + ":" + s + " " + ago;
}

var COOKIE_NAME_USERNAME = "ncusername";
var COOKIE_SHOW_NOTIFICATION = "ncshownotification";

function getCookie(cname, defaultValue) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return defaultValue;
}

function setCookie(cname, cvalue, exdays) {
    if (!exdays)
        exdays = 7;
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function detectmob() {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true;
    } else {
        return false;
    }
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

//source : http://stackoverflow.com/questions/6707476/how-to-find-if-a-text-contains-url-string
function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
}

//SOURCE : http://stackoverflow.com/questions/29774836/failed-to-construct-notification-illegal-constructor
function isNewNotificationSupported() {
    if (!detectmob())
        return true;

    if (!window.Notification || !Notification.requestPermission)
        return false;

    Notification.requestPermission();
    var notification = null;
    try {
        notification = new Notification('');
        notification.close();
    } catch (e) {
        if (e.name == 'TypeError')
            return false;
    } finally {
        if (notification && notification.close)
            notification.close();
    }
    return true;
}

function getCurrentHost() {

    var url = window.location.protocol + "//" + window.location.hostname;
    if (window.location.port) {
        url += ":" + window.location.port;
    }
    return url;
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function testImage(url, callback, timeout) {
    timeout = timeout || 5000;
    var timedOut = false, timer;
    var img = new Image();
    img.onerror = img.onabort = function() {
        if (!timedOut) {
            clearTimeout(timer);
            callback(url, "error");
        }
    };
    img.onload = function() {
        if (!timedOut) {
            clearTimeout(timer);
            callback(url, "success");
        }
    };
    img.src = url;
    timer = setTimeout(function() {
        timedOut = true;
        callback(url, "timeout");
    }, timeout); 
}

function hideAddressBar()
{
    if(!window.location.hash)
    { 
        if(document.height <= window.outerHeight + 10)
        {
            document.body.style.height = (window.outerHeight + 50) +'px';
            setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
        }
        else
        {
            setTimeout( function(){ window.scrollTo(0, 1); }, 0 ); 
        }
    }
} 

window.addEventListener("load", function(){ if(!window.pageYOffset){ hideAddressBar(); } } );
window.addEventListener("orientationchange", hideAddressBar );


var emejiList = [
    { key: ":D", val: "😁" },
    { key: ">:)", val: "😈" },
    { key: " :))", val: "😂" },
    { key: ":)", val: "😊" },
    { key: ";)", val: "😜" },
    { key: ":P", val: "😜" },
    { key: ":(", val: "😔" },
    { key: ":/", val: "😕" },
    { key: ":|", val: "😐" },
    { key: "<3", val: "💗" },
    { key: ":*", val: "😘" },
    { key: ":@", val: "😡" },
    { key: ":O", val: "😲" },
    { key: ":?", val: "🤔" },
    { key: ":B", val: "🤓" },
    { key: ":S", val: "🤐" },
    { key: "B)", val: "😎" },
]

function emejiConverter(message) {

    for (var i = 0; i < emejiList.length; i++) {
        message = message.replaceAll(emejiList[i].key, emejiList[i].val);
    }
    return message;
}
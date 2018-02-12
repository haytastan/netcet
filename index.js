var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var database = require('./controllers/database');
var api = require("./controllers/api")(database);

var defaultPort = 880;
if (process.argv.indexOf("--port") != -1) {
    var port = process.argv[process.argv.indexOf("--port") + 1];
    var p = parseInt(port);
    if (!isNaN(p))
        defaultPort = p;
}

var path1 = __dirname + '/views/';


app.get('/', function (req, res) {
    res.sendFile(path1 + '/index.html');
});

app.use('/api', api);

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', function (socket) {
    socket.on('chat', function (msg) {
        msg.date = getDate();
        io.emit('chat', msg);
    });
    socket.on('connected', function (username) {
        if (!database.isExist("username", username)) {
            var d = new Date();
            database.add({ username: username, connectedAt: d.getTime() });
            io.emit('connected', username);
        } else {
            io.emit('error', { "type": "invalidusername", "message": "Invalid username : " + username });
        }
    });
    socket.on('disconnected', function (username) {
        if (database.remove("username", username)) {
            io.emit('disconnected', username);
            console.log(username + " disconnected");
        }
    });

    socket.on('image', function (msg) {
        // console.log(msg);
        // msg.date = getDate();
        socket.broadcast.emit('image', msg);
    });
});


http.listen(process.env.PORT || defaultPort, function () {
    console.log('listening on *:' + defaultPort);
});


function getDate() {
    var d = new Date();
    var h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    var s = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
    return h + ":" + m + ":" + s;
}
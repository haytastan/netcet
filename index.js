var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var log4js = require('log4js');

log4js.configure({
    appenders: {
        netcet: { type: 'file', filename: 'logs/console/log.txt', backups: 100, maxLogSize: 3000000 }
    },
    categories: { default: { appenders: ['netcet'], level: 'all' } }
});

var logger = log4js.getLogger('netcet');


var appConfig = require('./appConfig');
var database = require('./controllers/database');
var api = require("./controllers/api");

var path1 = __dirname + '/views/';

if (appConfig.logger && appConfig.logger.enabled == true) {
    var fs = require('fs')
    var morgan = require('morgan');
    var path = require('path')
    var rfs = require('rotating-file-stream')

    var logDirectory = path.join(__dirname, 'logs')
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
    var accessLogStream = rfs('access.log', {
        size: '1M',
        maxFiles: 50,
        path: logDirectory
    })

    accessLogStream.on('error', function (err) {
        logger.error("accessLogStream error!!");
        logger.error(err);
    });

    morgan.token('eventor-user', function (req, res) { return "guest" });

    app.use(morgan(':date[iso] - :eventor-user - :method :url :status :res[content-length] - :response-time ms',
        {
            stream: accessLogStream,
            skip: function (req, res) {
                return req.url.match(/\.(css|js|ico|map|ttf|jpeg|jpg|gif|png)$/) != null
            }
        }
    ));
}

app.get('/', function (req, res) {
    res.sendFile(path1 + '/index.html');
});

app.use('/api', api);
app.use('/logs', require("./controllers/log"));

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', function (socket) {

    socket.on('chat', function (msg) {
        msg.date = getDate();
        msg.username = socket.username;

        io.emit('chat', msg);

        logger.info(socket.id + " : " + socket.username + " > " + JSON.stringify(msg.msg));
    });

    socket.on('connected', function (username) {

        socket.username = username;

        logger.info(socket.id + " : " + socket.username + " connected")

        if (!database.isExist("username", socket.username)) {
            var d = new Date();
            database.add({ username: socket.username, connectedAt: d.getTime() });
            io.emit('connected', socket.username);
        } else {
            io.emit('error', { "type": "invalidusername", "message": "Invalid username : " + username });
        }
    });

    socket.on('disconnected', function (data) {
        if (socket.username && database.remove("username", socket.username)) {

            io.emit('disconnected', socket.username);

            logger.info(socket.id + " : " + socket.username + " disconnected, data : " + JSON.stringify(data));

        }
    });

});

const port = process.env.PORT || appConfig.port || 880;
http.listen(port, function () {
    logger.info('listening on *:' + port);
});


function getDate() {
    var d = new Date();
    var h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    var s = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
    return h + ":" + m + ":" + s;
}
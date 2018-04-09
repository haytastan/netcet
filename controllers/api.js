var express = require('express');
var router = express.Router();

var database = require('./database');

router.get('/users', function (req, res, next) {
    res.send(database.getAll());
});

router.get('/i18n', function (req, res, next) {
    res.send({
        "en": {
            translation: {
                "login-app-title": "Welcome to " + (process.env.TITLE || "NetCet v0.2"),
                "chat-app-title": (process.env.TITLE || "NetCet v0.2"),
            }
        },
    });
});

module.exports = router;
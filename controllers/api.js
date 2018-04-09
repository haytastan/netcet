var express = require('express');
var router = express.Router();

var database = require('./database');

router.get('/users', function (req, res, next) {
    res.send(database.getAll());
});

module.exports = router;
var express = require('express');
var router = express.Router();

module.exports = function(db) {


    router.get('/users', function(req, res, next) {
        res.send(db.getAll());
    });

    return router;
};
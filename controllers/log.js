var express = require('express');
var router = express.Router();


router.get('/console/', function (req, res, next) {
    res.sendFile('/logs/console/log.txt', { 'root': './' });
});

router.get('/console/:id', function (req, res, next) {
    res.sendFile('/logs/console/log.txt.' + req.params.id, { 'root': './' });
});

router.get('/access/', function (req, res, next) {
    res.sendFile('/logs/access.log', { 'root': './' });
});

module.exports = router;
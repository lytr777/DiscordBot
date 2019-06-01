var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.session.user);
    res.render('panel', { title: 'Solaire Bot', username: req.session.user});
});

module.exports = router;

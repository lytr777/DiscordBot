var express = require('express');
var User = require('../models/User').User;
var HttpError = require('../errors').HttpError;
var DatabaseError = require('../errors').DatabaseError;
var router = express.Router();

router.post('/', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.authorize(username, password, function (err, user) {
        if (err) {
            if (err instanceof DatabaseError) {
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }
        req.session.user = user._id;
        res.send({});
    });
});

module.exports = router;

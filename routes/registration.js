const express = require('express');
const User = require('../models/User').User;
const HttpError = require('../errors').HttpError;
const DatabaseError = require('../errors').DatabaseError;
const router = express.Router();

router.post('/', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const password_check = req.body.password_check;
    const key = req.body.key;

    if (password !== password_check) {
        return next(new HttpError(403, 'Passwords don\'t match'));
    }

    User.createUser(username, password, key, function (err, user) {
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
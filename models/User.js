const crypto = require('crypto');
const async = require('async');
const DatabaseError = require('../errors/index').DatabaseError;

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let schema = new Schema({
    discordId: {
        type: String,
        unique: true,
        required: true
    },
    keySalt: {
        type: String,
        required: true
    },
    key: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
    },
    hashedPassword: {
        type: String
    },
    salt: {
        type: String
    },
    role: {
        type: Number,
        default: 0
    },
    availableSpace: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function (password) {
    let salt = this.salt.toString;
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });


schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.generateKey = function (discordId, keySalt, callback) {
    let User = this;
    let key = crypto.createHmac('sha1', keySalt).update(discordId).digest('hex');

    async.waterfall([
        function (callback) {
            User.findOne({discordId: discordId}, callback);
        },
        function (user, callback) {
            if (user) {
                callback(null, user);
            } else {
                let user = new User({
                    discordId: discordId,
                    keySalt: keySalt,
                    key: key
                });
                user.save(function (err, user) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, user);
                    }
                });
            }
        }
    ], callback)
};

schema.statics.createUser = function (username, password, key, callback) {
    let User = this;

    async.waterfall([
        function (callback) {
            User.findOne({key: key}, callback);
        },
        function (user, callback) {
            if (user) {
                if (user.username)
                    callback(new DatabaseError('User for this key already created'));
                else {
                    user.username = username;
                    user.password = password;
                    user.markModified(['username', 'salt', 'hashedPassword']);
                    user.save(function (err, user) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, user);
                        }
                    });
                }
            } else {
                callback(new DatabaseError('Key not found'));
            }
        }
    ], callback)
};

schema.statics.authorize = function (username, password, callback) {
    let User = this;

    async.waterfall([
        function (callback) {
            User.findOne({username: username}, callback);
        },
        function (user, callback) {
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    callback(new DatabaseError("Password is incorrect"));
                }
            } else {
                callback(new DatabaseError("User not found"));
            }
        }
    ], callback);
};

exports.User = mongoose.model('User', schema);
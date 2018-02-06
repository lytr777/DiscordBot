const async = require('async');

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let schema = new Schema({
    trackId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        unique: true,
        required: true
    },
    popularity: {
        type: Number,
        default: 0
    },
    added: {
        type: Date,
        default: Date.now
    }
});

schema.statics.getTrackById = function (id, callback) {
    let TrackStorage = this;

    async.waterfall([
        function (callback) {
            TrackStorage.findOne({trackId: id}, callback)
        },
        function (track, callback) {
            if (track) {
                track.popularity += 1;
                track.markModified(['popularity']);
                track.save(function (err) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, track)
                    }
                });
            } else {
                callback(new Error('Track not found'))
            }
        }
    ], callback)
};

schema.statics.addTrack = function (trackInfo, callback) {
    let HashedTrack = this;

    async.waterfall([
        function (callback) {
            HashedTrack.findOne({trackId: trackInfo.id}, callback)
        },
        function (track, callback) {
            if (track) {
                callback(null, track)
            } else {
                let track = new HashedTrack({
                    trackId: trackInfo.id,
                    name: trackInfo.name,
                    duration: trackInfo.duration,
                    path: trackInfo.path
                });
                track.save(function (err, track) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, track)
                    }
                });
            }
        }
    ], callback)
};

exports.HashedTrack = mongoose.model('HashedTrack', schema);
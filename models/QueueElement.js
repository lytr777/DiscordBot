const async = require('async');

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let schema = new Schema({
    guildId: {
        type: String,
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
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    added: {
        type: Date,
        default: Date.now
    }
});

schema.statics.addElement = function (guildId, elementInfo, callback) {
    let QueueElement = this;
    let element = new QueueElement({
        guildId: guildId,
        name: elementInfo.name,
        duration: elementInfo.duration,
        path: elementInfo.path
    });
    element.save(function (err, element) {
        if (err) {
            callback(err)
        } else {
            callback(null, element)
        }
    })
};

schema.statics.getCurrent = function (guildId, callback) {
    let QueueElement = this;
    QueueElement.findOne({guildId: guildId}, null, {sort: 'added'}, callback)
};

schema.statics.updateProgress = function (elementId, newProgress, callback) {
    let QueueElement = this;
    QueueElement.findByIdAndUpdate(elementId, {$set: {progress: newProgress}}, callback)
};

schema.statics.removeById = function (elementId, callback) {
    let QueueElement = this;
    QueueElement.findByIdAndRemove(elementId, callback)
};

// schema.statics.getNext = function (guildId, callback) {
//     let QueueElement = this;
//
//     async.waterfall([
//         function (callback) {
//             QueueElement.find({guildId: guildId}, null, {sort: 'added'}, callback)
//         },
//         function (elements, callback) {
//             let nextElement = null;
//             if (elements.length > 1) {
//                 nextElement = elements[1];
//             }
//             if (elements.length > 0) {
//                 elements[0].remove((err, element) => callback(err, nextElement))
//             } else {
//                 callback(null, nextElement)
//             }
//         }
//     ], callback)
// };

exports.QueueElement = mongoose.model('QueueElement', schema);
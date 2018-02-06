const QueueElement = require('../../../models/QueueElement').QueueElement;

const ChatAction = require('./ChatAction');
const RefillOfQueueAction = require('./RefillOfQueueAction');

const Dictionary = require('../util/Dictionary').Rus;
const Formatter = require('../util/Formatter');

class AddTrackAction {

    constructor(trackInfo) {
        this.trackInfo = trackInfo;
        this.type = 'callback'
    }

    start(guild, callback) {
        QueueElement.addElement(guild.id, this.trackInfo, function (err, track) {
            if (err) {
                console.log(err);
                callback([new ChatAction(Dictionary['player_add_err'](this.trackInfo.name))])
            } else {
                let time = Formatter.formatTime(this.trackInfo.duration);
                callback([
                    new ChatAction(Dictionary['player_add'](this.trackInfo.name, time)),
                    new RefillOfQueueAction()
                ])
            }
        }.bind(this));
    }
}

module.exports = AddTrackAction;
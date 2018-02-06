const ChatAction = require('./ChatAction');
const Dictionary = require('../util/Dictionary').Rus;

class LeaveChannelAction {

    constructor() {
        this.type = 'channel';
    }

    start(guildConnection) {
        let channelConnection = guildConnection.channelConnection;
        if (channelConnection) {
            let name = channelConnection.channel.name;
            channelConnection.close();
            guildConnection.channelConnection = null;
            return [new ChatAction(Dictionary['leave_channel'](name))]
        } else {
            guildConnection.channelConnection = null;
            return [new ChatAction(Dictionary['no_channel']())]
        }
    }
}

module.exports = LeaveChannelAction;
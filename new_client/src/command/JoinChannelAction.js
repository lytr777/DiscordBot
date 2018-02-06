const ChatAction = require('./ChatAction');
const Dictionary = require('../util/Dictionary').Rus;
const ChannelConnection = require('../ChannelConnection');

class JoinChannelAction {

    constructor(name) {
        this.name = name;
        this.type = 'channel';
    }

    start(guildConnection, voiceChannels) {
        let channelConnection = guildConnection.channelConnection;
        for (let i = 0; i < voiceChannels.length; i++) {
            if (voiceChannels[i].name === this.name) {
                let leavedChannel = null;
                if (channelConnection) {
                    if (channelConnection.channel.id === voiceChannels[i].id) {
                        return [new ChatAction(Dictionary['already_channel'](this.name))]
                    }
                    leavedChannel = channelConnection.channel.name;
                    channelConnection.close();
                }
                guildConnection.channelConnection = new ChannelConnection(guildConnection, voiceChannels[i]);
                if (leavedChannel) {
                    return [new ChatAction(Dictionary['change_channel'](leavedChannel, this.name))]
                }
                else {
                    return [new ChatAction(Dictionary['join_channel'](this.name))]
                }
            }
        }
        return [new ChatAction(Dictionary['not_found_channel'](this.name))]
    }
}

module.exports = JoinChannelAction;
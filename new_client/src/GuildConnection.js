const MessageParser = require('./util/MessageParser');

class GuildConnection {

    constructor(client, guild, consoleChat, myId) {
        this.client = client;
        this.guild = guild;
        this.consoleChat = consoleChat;
        this.myId = myId;

        this.messageCollector = this.consoleChat.createMessageCollector(() => true);
        this.channelConnection = null;

        this.messageCollector.on('collect', this.collectCommand.bind(this));
        this.messageCollector.on('end', this.endCollection.bind(this))
    }

    collectCommand(message, collector) {
        if (!this.checkId(message.author.id))
            return;

        let action = MessageParser.parse(message.content);
        this.startActions(action);
    }

    startActions(actions) {
        for (let i = 0; i < actions.length; i++) {
            let action = actions[i];
            switch (action.type) {
                case 'chat':
                    action.start(this.consoleChat);
                    break;

                case 'channel':
                    let voiceChannels = this.guild.channels.array().filter((item) => item.type == 'voice');
                    this.startActions(action.start(this, voiceChannels));
                    break;

                case 'callback':
                    action.start(this.guild, this.startActions.bind(this));
                    break;

                case 'player':
                    action.start(this.channelConnection);
                    break;
            }
        }
    }

    checkId(id) {
        return id != this.myId
    }

    endCollection(collected, reason) {

    }
}

module.exports = GuildConnection;
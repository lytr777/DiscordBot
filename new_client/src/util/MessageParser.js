const fs = require('fs');

const ChatAction = require('../command/ChatAction');
const JoinChannelAction = require('../command/JoinChannelAction');
const LeaveChannelAction = require('../command/LeaveChannelAction');
const DownloadTrackAction = require('../command/DownloadTrackAction');
const QueueNextAction = require('../command/QueueNextAction');

const Dictionary = require('./Dictionary').Rus;
const LinkChecker = require('./LinkChecker');

class MessageParser {

    constructor() {
        fs.readFile('new_client/help', 'utf8', function (error, text) {
            if (error) {
                console.log(error);
            } else {
                this.helpContent = text;
            }
        }.bind(this));

        this.commands = {
            'help': function () {
                if (this.helpContent) {
                    return [new ChatAction(this.helpContent)];
                } else {
                    return [];
                }
            }.bind(this),

            'join': function (splitName) {
                let channelName = splitName.join(' ');
                if (channelName.length > 0) {
                    return [new JoinChannelAction(channelName)];
                } else {
                    return [new ChatAction(Dictionary['incorrect_channel']())];
                }
            },

            'leave': function () {
                return [new LeaveChannelAction()];
            },

            'add': function (args) {
                if (args.length >= 2) {
                    switch (args[0]) {
                        case '-yt':
                            if (LinkChecker.checkYoutube(args[1])) {
                                return [new DownloadTrackAction(args[1])];
                            } else {
                                return [new ChatAction(Dictionary['yt_incorrect'](args[1]))];
                            }
                        default:
                            return [new ChatAction(Dictionary['unknown_argument'](args[0], args[1]))];
                    }
                } else {
                    return [new ChatAction(Dictionary['incorrect_length']('add', args.length()))];
                }
            },

            'next': function () {
                return [new QueueNextAction()];
            }
        }
    }

    parse(content) {
        let splitContent = content.split(' ');
        let commandName = splitContent.shift();
        if (this.commands[commandName]) {
            return this.commands[commandName](splitContent);
        } else {
            return [new ChatAction(Dictionary['unknown'](commandName))];
        }
    }
}

const messageParser = new MessageParser();

module.exports = messageParser;
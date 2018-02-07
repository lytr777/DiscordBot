const QueueElement = require('../../models/QueueElement').QueueElement;
const ChatAction = require('./command/ChatAction');
const Dictionary = require('./util/Dictionary').Rus;
const Formatter = require('./util/Formatter');
const StringToStream = require('string-to-stream');
const fs = require("fs");

const timeEps = 10;
const praise = './files/praise';

class Player {
    constructor(guildConnection, connection, options = {seek: 0, volume: 0.1}) {
        this.guildConnection = guildConnection;
        this.connection = connection;
        this.options = options;
        this.dispatcher = null;
        this.praiseString = null;
        this.praise()
    }

    praise() {
        if (this.dispatcher) {
            this.dispatcher.end('praise');
            return
        }
        if (!this.praiseString) {
            this.praiseString = 'data:audio/webm;base64,' + fs.readFileSync(praise, 'base64');
        }
        this.dispatcher = this.connection.playArbitraryInput(this.praiseString, this.options);
        this.dispatcher.on('end', function (reason) {
            console.log('Praise dispatcher end with reason : ' + reason);
            this.dispatcher = null;
            this.next(true)
        }.bind(this))
    }

    next(silent) {
        if (this.dispatcher) {
            this.dispatcher.end('next');
            return
        }
        QueueElement.getCurrent(this.guildConnection.guild.id, function (err, track) {
            if (err) {
                console.log('Player error while track getting: ' + err.message)
            } else {
                if (track) {
                    this.playTrack(track)
                } else if (!silent) {
                    this.guildConnection.startActions([new ChatAction([Dictionary['empty']()])]);
                }
            }
        }.bind(this))
    }

    playTrack(track) {
        this.options.seek = track.progress;
        // let trackStream = StringToStream('data:audio/webm;base64,' + fs.readFileSync(track.path, 'base64'));
        let trackStream = StringToStream(fs.readFileSync(track.path));
        this.dispatcher = this.connection.playStream(trackStream, this.options);
        let tag = (this.options.seek === 0) ? 'player_play' : 'player_play_seek';
        this.guildConnection.startActions([new ChatAction([Dictionary[tag](track.name,
            Formatter.formatTime(track.duration), Formatter.formatTime(track.progress))])]);

        this.dispatcher.on('end', function (reason) {
            console.log('Dispatcher end with reason : ' + reason);
            let playedTime = Math.floor(this.dispatcher.time / 1000) + track.progress;

            this.dispatcher = null;
            let timeCondition = (track.duration - playedTime > timeEps);
            if (reason === 'praise') {
                this.databaseUpdate(track._id, playedTime, this.praise.bind(this));
                return
            }
            if (reason === 'next' || reason === 'stream' || !timeCondition) {
                this.removeAndNext(track)
            } else {
                this.databaseUpdate(track._id, playedTime);
            }
        }.bind(this));

        this.dispatcher.on('error', console.log);
    }

    removeAndNext(track) {
        QueueElement.removeById(track._id, (err, track) => {
            if (err) {
                console.log('Error while remove track : ' + err.message)
            } else {
                console.log('Remove track from queue ' + track.name);
                this.next()
            }
        })
    }

    databaseUpdate(id, playedTime, callback) {
        QueueElement.updateProgress(id, playedTime, function (err, track) {
            if (err) {
                console.log('Error while update time (' + playedTime + ') :' + err.message);
            }
            if (track) {
                console.log('Update time (' + playedTime + ') for track ' + track.name);
            }
            if (callback) {
                callback()
            }
        });
    }


    destroy() {
        if (this.dispatcher) {
            this.dispatcher.end('destroy');
        }
        this.connection = null;
    }
}

module.exports = Player;
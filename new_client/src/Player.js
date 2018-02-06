const QueueElement = require('../../models/QueueElement').QueueElement;
const ChatAction = require('./command/ChatAction');
const Dictionary = require('./util/Dictionary').Rus;
const Formatter = require('./util/Formatter');

const timeEps = 10;
const praise = './files/praise';

class Player {
    constructor(guildConnection, connection, options = {seek: 0, volume: 0.1}) {
        this.guildConnection = guildConnection;
        this.connection = connection;
        this.options = options;
        this.dispatcher = null;
        this.next(true)
    }

    next(first) {
        if (first) {
            this.playTrack();
            return
        }
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
                } else {
                    this.guildConnection.startActions([new ChatAction([Dictionary['empty']()])]);
                }
            }
        }.bind(this))

    }

    playTrack(track) {
        if (track) {
            this.options.seek = track.progress;
            this.dispatcher = this.connection.playFile(track.path, this.options);
            let tag = (this.options.seek === 0) ? 'player_play' : 'player_play_seek';
            this.guildConnection.startActions([new ChatAction([Dictionary[tag](track.name,
                Formatter.formatTime(track.duration), Formatter.formatTime(track.progress))])]);

            this.dispatcher.on('end', function (reason) {
                console.log('Dispatcher end with reason : ' + reason);
                let playedTime = Math.floor(this.dispatcher.time / 1000) + track.progress;

                this.dispatcher = null;
                let timeCondition = (track.duration - playedTime > timeEps);
                if (reason === 'next' || reason === 'stream' || !timeCondition) {
                    this.removeAndNext(track)
                } else {
                    QueueElement.updateProgress(track._id, playedTime, (err, track) => {
                        if (err) {
                            console.log('Error while update time (' + playedTime + ') :' + err.message);
                        }
                        if (track) {
                            console.log('Update time (' + playedTime + ') for track ' + track.name);
                        }
                    });
                }
            }.bind(this));

            this.dispatcher.on('error', console.log);
        } else {
            this.dispatcher = this.connection.playFile(praise, this.options);
            this.dispatcher.on('end', function (reason) {
                this.dispatcher = null;
                this.next()
            }.bind(this))
        }
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


    destroy() {
        if (this.dispatcher) {
            this.dispatcher.end('destroy');
        }
        this.connection = null;
    }
}

module.exports = Player;
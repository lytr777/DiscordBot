const tag = 'ChannelConnection';
const Player = require('./Player');

class ChannelConnection {

    constructor(guildConnection, channel) {
        this.guildConnection = guildConnection;
        this.channel = channel;
        this.connection = null;
        this.dispatcher = null;
        this.player = null;

        channel.join()
            .then(function (connection) {
                this.connection = connection;
                this.ready();

                this.connection.on('ready', this.ready.bind(this));
                this.connection.on('error', this.error.bind(this));
                this.connection.on('reconnecting', this.reconnecting.bind(this));
                this.connection.on('disconnect', this.disconnect.bind(this))
            }.bind(this))
            .catch(function (err) {
                console.log(tag + ': channel connection error: ' + err.message)
            })
    }

    ready() {
        console.log(tag + '(' + this.connection.status + '): channel ' + this.getChannel().name + ' is ready');
        this.reset();
        this.player = new Player(this.guildConnection, this.connection)
    }

    error(err) {
        console.log(tag + '(' + this.connection.status + '): channel ' + this.getChannel().name + ' catch error: ' + err.message)
    }

    reconnecting() {
        console.log(tag + '(' + this.connection.status + '): try reconnect to channel ' + this.getChannel().name)
    }

    disconnect() {
        console.log(tag + '(' + this.connection.status + '): disconnected from channel ' + this.getChannel().name)
    }

    reset() {
        if (this.player) {
            this.player.destroy()
        }
    }

    getChannel() {
        if (this.connection) {
            return this.connection.channel
        }
        return null
    }

    next() {
        if (this.dispatcher) {
            this.dispatcher.end('next')
        }
    }

    close() {
        this.reset();
        this.connection.disconnect();
        this.connection = null
    }
}

module.exports = ChannelConnection;
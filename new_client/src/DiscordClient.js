const discord = require('discord.js');
const GuildConnection = require('./GuildConnection');

const tag = 'DiscordClient';
const consoleName = 'bot_console';

class DiscordClient {

    constructor() {
        this.client = new discord.Client();
        this.guildList = [];

        this.client.on('ready', this.ready.bind(this));
        this.client.on('error', this.error.bind(this));
        this.client.on('reconnecting', this.reconnecting.bind(this));
        this.client.on('resume', this.resume.bind(this));
        this.client.on('disconnect', this.disconnect.bind(this));
    }

    login(token) {
        this.client.login(token)
    }

    ready() {
        console.log(tag + '(' + this.client.status + '): ready');
        this.myId = this.client.user.id;
        this.reset();
        this.connectToGuilds()
    }

    resume(replayed) {
        console.log(tag + '(' + this.client.status + '): resume and replayed ' + replayed + ' events')
    }

    error(err) {
        console.log(tag + '(' + this.client.status + '): catch error: ' + err.message)
    }

    reconnecting() {
        console.log(tag + '(' + this.client.status + '): reconnecting')
    }

    disconnect(event) {
        console.log(tag + '(' + this.client.status + '): disconnect with event ' + event)
    }

    reset() {
        for (let i = 0; i < this.guildList.lenght; i++) {
            this.guildList[i].close()
        }
        this.guildList = []
    }

    connectToGuilds() {
        let guilds = this.client.guilds.array();
        for (let i = 0; i < guilds.length; i++) {
            // console.log('guild: ' + guilds[i].name);
            let channels = guilds[i].channels.array();
            for (let j = 0; j < channels.length; j++) {
                // console.log('--- channel: ' + channels[j].name);
                if (channels[j].type === 'text' && channels[j].name === consoleName) {
                    let guildConnection = new GuildConnection(this, guilds[i], channels[j], this.myId);
                    this.guildList.push(guildConnection)
                }
            }
        }
    }
}

module.exports = DiscordClient;
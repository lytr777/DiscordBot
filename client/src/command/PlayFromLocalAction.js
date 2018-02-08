class PraiseAction {

    constructor(name) {
        this.name = name;
        this.type = 'player'
    }

    start(connection) {
        if (connection && connection.player) {
            connection.player.playFromLocal(this.name)
        }
    }
}

module.exports = PraiseAction;
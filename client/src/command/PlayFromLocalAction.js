class PraiseAction {

    constructor(name) {
        this.name = name;
        this.type = 'player'
    }

    start(connection) {
        if (connection && connection.player) {
            connection.player.playFromLocal(name)
        }
    }
}

module.exports = PraiseAction;
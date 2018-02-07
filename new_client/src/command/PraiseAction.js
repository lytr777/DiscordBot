class PraiseAction {
    constructor() {
        this.type = 'player'
    }

    start(connection) {
        if (connection && connection.player) {
            connection.player.praise()
        }
    }
}

module.exports = PraiseAction;
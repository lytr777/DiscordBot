class QueueNextAction {

    constructor() {
        this.type = 'player'
    }

    start(connection) {
        if (connection && connection.player) {
            connection.player.next()
        }
    }
}

module.exports = QueueNextAction;
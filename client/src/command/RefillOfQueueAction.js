class RefillOfQueueAction {

    constructor() {
        this.type = 'player';
    }

    start(connection) {
        if (connection && connection.player && !connection.player.dispatcher) {
            connection.player.next()
        }
    }
}

module.exports = RefillOfQueueAction;
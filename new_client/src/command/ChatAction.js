class ChatAction {

    constructor(text) {
        this.text = text;
        this.type = 'chat'
    }

    start(chat, callback) {
        chat.send(this.text)
            .then(function (message) {
                console.log('message sent: ' + message.content);
                if (callback) {
                    callback(message)
                }
            })
            .catch(function (error) {
                console.log('error of sending: ' + error.message)
            })
    }
}

module.exports = ChatAction;
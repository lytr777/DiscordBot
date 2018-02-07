class Config {

    constructor() {
    }

    set(options) {
        this.options = options
    }

    get() {
        return this.options
    }
}

let config = new Config();

module.exports = {
    set: config.set,
    get: config.get
};
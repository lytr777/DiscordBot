const mongoose = require('./mongoose');
const session = require('express-session');
const MongooseStore = require('connect-mongo')(session);

const sessionStore = new MongooseStore({
    mongooseConnection: mongoose.connection
});

module.exports = sessionStore;
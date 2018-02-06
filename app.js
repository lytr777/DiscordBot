var express = require('express');
var session = require('express-session');
var path = require('path');
var config = require('./config');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessionStore = require('./lib/sessionStore');
var checkAuth = require('./middleware/checkAuth');
var authRedirect = require('./middleware/authRedirect');
var HttpError = require('./errors').HttpError;

var index = require('./routes/index');
var panel = require('./routes/panel');
var registration = require('./routes/registration');
var login = require('./routes/login');
var logout = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
    secret: config.get('session:secret') + '',
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

app.use('/', authRedirect, index);
app.use('/panel', checkAuth, panel);
app.use('/registration', registration);
app.use('/login', login);
app.use('/logout', logout);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    }
});

module.exports = app;
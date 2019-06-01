module.exports = function (req, res, next) {
    res.sendHttpError = function (err) {
        res.status(err.status);
        if (res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
            console.log(err);
            res.json(err);
        } else {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.render('error');
        }
    };
    next();
};
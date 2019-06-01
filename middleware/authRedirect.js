module.exports = function (req, res, next) {
    if (req.session.user && req.url === '/') {
        res.redirect('/panel');
    } else {
        next();
    }
};
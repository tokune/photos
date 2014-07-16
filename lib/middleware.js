var config = require('../config');
                               
exports.login_middleware = function(req, res, next) {
    if (req.path === '/') return next();
    if (req.session.password === config.password) return next();
    res.redirect('/');         
}; 

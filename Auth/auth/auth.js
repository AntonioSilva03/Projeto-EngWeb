var jwt = require('jsonwebtoken');

module.exports.isAdmin = function(req, res, next) {
    var token = req.headers.authorization;
    if (!token) {
        res.status(401).jsonp({error: 'Token not found'});
    } else {
        jwt.verify(token, 'EW2024', function(err, decoded) {
            if (err) {
                res.status(401).jsonp({error: 'Token not valid'});
            } else {
                if (decoded.nivel === 'admin') {
                    next();
                } else {
                    res.status(403).jsonp({error: 'Permission denied'});
                }
            }
        });
    }
}

module.exports.verify = function(req, res, next) {
    var token = req.headers.authorization;
    if (!token) {
        res.status(401).jsonp({error: 'Token not found'});
    } else {
        jwt.verify(token, 'EW2024', function(err, decoded) {
            if (err) {
                res.status(401).jsonp({error: 'Token not valid'});
            } else {
                next();
            }
        });
    }
}
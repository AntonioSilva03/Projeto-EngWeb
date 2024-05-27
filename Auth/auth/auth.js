var jwt = require('jsonwebtoken');

module.exports.isAdmin = function(req, res, next) {
    var token = req.query.token || req.body.token
    if (token) {
        jwt.verify(token, 'EW2024', function(err, payload) {
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

    else {
        res.status(401).jsonp({error: 'Token not found'});
    }
}

module.exports.verify = function(req, res, next) {
    var token = req.query.token || req.body.token
    if (token) {
        jwt.verify(token, 'EW2024', function(err, payload) {
            if (err) {
                res.status(401).jsonp({error: 'Token not valid'});
            } else {
                next();
            }
        });
    }

    else {
        res.status(401).jsonp({error: 'Token not found'});
    }
}
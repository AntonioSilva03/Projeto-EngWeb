var jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
    let token = req.cookies.token
    if (token) {
        jwt.verify(token, "EW2024", function (e, payload) {
            if (e) { // ocorreu um erro
                res.redirect('/login')
            }
            else {
                req.idUser = payload._id
                req.email = payload.email
                req.nivel = payload.level
                next()
            }
        })
    } else {
        req.session.redirectTo = req.originalUrl
        res.redirect('/login')
    }
}
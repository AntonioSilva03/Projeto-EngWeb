var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var multer = require('multer')

var Uc = require('../controllers/uc');
var User = require('../controllers/user');
var Ficheiro = require('../controllers/ficheiro');

function auth(req, res, next) {
    let token = req.body.token || req.query.token
    delete req.body.token
    delete req.query.token
    if (token) {
        jwt.verify(token, "EW2024", function (e, payload) {
            if (e) {
                res.status(401).jsonp({error: e})
            } 
            
            else {
                req.user = payload
                next()
            }
        })
    } else {
        res.status(401).jsonp({error: 'Error: No token was provided'})
    }
}

// GET /users
router.get('/users', function(req, res) {
    User.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

// GET /cadeiras
router.get('/cadeiras', function(req, res) {
    Uc.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

// GET /cadeiras/:_id
router.get('/cadeiras/:_id', auth, function(req, res) {
    if (req.user) {
        Uc.lookUp(req.params._id)
            .then(data => res.jsonp(data))
            .catch(error => res.status(500).jsonp(error))
    }
});

// GET /cadeiras/:_id/alunos
router.get('/cadeiras/:_id/alunos', auth, function(req, res) {
    if (req.user) {
        Uc.listInscritos(req.params._id)
            .then(data => res.jsonp(data.inscritos))
            .catch(error => res.status(500).jsonp(error))
    }
});

// GET /cadeiras/:_id/ficheiros
router.get('/cadeiras/:_id/ficheiros', auth, function(req, res) {
    if (req.user) {
        Ficheiro.listCadeira(req.params._id)
            .then(data => res.jsonp(data))
            .catch(error => res.status(500).jsonp(error))
    }
});

// GET /cadeiras/:_id/ficheiros/:_idFicheiro
router.get('/cadeiras/:_id/ficheiros/:_idFicheiro', auth, function(req, res) {
    if (req.user) {
        Ficheiro.lookUp(req.params._idFicheiro)
            .then(data => res.jsonp(data))
            .catch(error => res.status(500).jsonp(error))
    }
});

// GET /cadeiras/:_id/ficheiros/:_idFicheiro/download
router.get('/cadeiras/:_id/ficheiros/:_idFicheiro/download', auth, function(req, res) {
    if (req.user) {
        Ficheiro.lookUp(req.params._idFicheiro)
            .then(data => {
                res.download(data.path)
            })
            .catch(error => res.status(500).jsonp(error))
    }
});

// GET /users/:_id
router.get('/users/:_id', auth, function(req, res) {
    if (req.user._id === req.params._id) {
        User.lookUp(req.params._id)
            .then(data => res.jsonp(data))
            .catch(error => res.status(500).jsonp(error))
    }
});

// GET users/:_id/cadeiras
router.get('/users/:_id/cadeiras', auth, function(req, res) {
    if (req.user._id === req.params._id) {
        User.getCadeiras(req.params._id)
            .then(data => res.jsonp(data.cadeiras))
            .catch(error => res.status(500).jsonp(error))
    }
});

// POST
router.post('/', auth, function(req, res) {
    // testar se o level do user é docente ou admin
    if (req.user.nivel != 'docente' && req.user.nivel != 'admin') {
        res.status(401).jsonp({error: 'User not authorized'})
        return
    }
    Uc.insert(req.body)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

// POST /cadeiras/:_id/ficheiros (docentes ou admin)

// DELETE /cadeiras/:_id (docentes ou admin)
router.delete('/cadeiras/:_id', auth, function(req, res) {
    if (req.user.nivel != 'docente' && req.user.nivel != 'admin') {
        res.status(401).jsonp({error: 'User not authorized'})
        return
    }
    Uc.remove(req.params._id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

// DELETE /cadeiras/:_id/ficheiros/:_idFicheiro (docentes ou admin)

module.exports = router;
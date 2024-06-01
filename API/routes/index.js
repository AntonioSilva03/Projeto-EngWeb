var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var multer = require('multer')
var mongoose = require('mongoose');

var Uc = require('../controllers/uc');
var User = require('../controllers/user');
var Ficheiro = require('../controllers/ficheiro');
const { TriggerOpTypes } = require('vue');

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

// GET /cadeiras
router.get('/cadeiras', function(req, res) {
    Uc.list()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

// GET /cadeiras/:_id
router.get('/cadeiras/:_id', auth, function(req, res) {
    Uc.lookUp(req.params._id)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
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

// GET /users
router.get('/users', auth, function(req, res) {
    if (req.user) {
        User.list()
            .then(data => {
                res.status(200).jsonp(data)
            })
            .catch(error => res.status(500).jsonp(error))
    }
});

// GET /users/:_id
router.get('/users/:_id', auth, function(req, res) {
    if (req.user) {
        User.lookUp(req.params._id)
            .then(data => res.status(200).jsonp(data))
            .catch(error => res.status(500).jsonp(error))
    }
});

// GET users/:_id/cadeiras
router.get('/users/:_id/cadeiras', auth, function(req, res) {
    Uc.list()
        .then(data => {
            let cadeiras = []
            data.forEach(uc => {
                if (uc.docentes.includes(req.params._id)) {
                    cadeiras.push(uc)
                }
            })
            res.jsonp(cadeiras)
        })
        .catch(error => res.status(500).jsonp(error))
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

// POST /cadeiras
router.post('/cadeiras', auth, function(req, res) {
    if (req.user.level !== 'docente' && req.user.level !== 'admin') {
        res.status(401).jsonp({error: 'User not authorized'})
        return
    }
    const uc = {
        _id: new mongoose.Types.ObjectId(),
        numero: req.body.numero,
        titulo: req.body.titulo,
        sigla: req.body.sigla,
        docentes: req.body.docentes.split(','),
        horario: {
            teoricas: req.body.horario_teoricas.split(','),
            praticas: req.body.horario_praticas.split(',')
        },
        avaliacao: req.body.avaliacao.split(','),
        datas: {
            teste: req.body.datas_teste,
            exame: req.body.datas_exame,
            projeto: req.body.datas_projeto
        },
        aulas: [],
        inscritos: []
    }
    Uc.insert(uc)
        .then(data => res.jsonp(data))
        .catch(error => {
            console.log(error)
            res.status(500).jsonp(error)
        })
});

// POST /cadeiras/:_id/update (docentes ou admin)
router.post('/cadeiras/:_id/update', auth, function(req, res) {
    if (req.user.level !== 'docente' && req.user.level !== 'admin') {
        res.status(401).jsonp({error: 'User not authorized'})
        return
    }
    const uc_updates = {
        docentes: req.body.docentes,
        horario: {
            teoricas: req.body.horario_teoricas,
            praticas: req.body.horario_praticas
        },
        avaliacao: req.body.avaliacao,
        datas: {
            teste: req.body.datas_teste,
            exame: req.body.datas_exame,
            projeto: req.body.datas_projeto
        }
    }
    Uc.update(req.params._id, uc_updates)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

// POST /cadeiras/:_id/sumarios (docentes)
router.post('/cadeiras/:_id/sumarios', auth, function(req, res) {
    if (req.user.level != 'docente') {
        res.status(401).jsonp({error: 'User not authorized'})
        return
    }
    const sumario = {
        tipo: req.body.aula,
        data: req.body.data,
        sumario: req.body.conteudo.split(',')
    }
    Uc.addSumario(req.params._id, sumario)
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

// PUT /users/:_id
router.put('/users/:_id', auth, function(req, res) {
    if (req.user._id === req.params._id) {
        User.update(req.params._id, req.body)
            .then(data => res.jsonp(data))
            .catch(error => res.status(500).jsonp(error))
    }
});

// DELETE /cadeiras/:_id/ficheiros/:_idFicheiro (docentes ou admin)

module.exports = router;
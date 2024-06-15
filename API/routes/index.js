var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var multer = require('multer')
var mongoose = require('mongoose');

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

// GET /cadeiras
router.get('/cadeiras', function(req, res) {
    Uc.list()
        .then(data => {
            res.jsonp(data)
        })
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
            .then(response => {
                const alunoPromises = response.inscritos.map(inscritoId => 
                    User.lookUp(inscritoId)
                );

                Promise.all(alunoPromises)
                    .then(alunos => {
                        res.jsonp(alunos);
                    })
                    .catch(error => res.status(500).jsonp(error));
            })
            .catch(error => res.status(500).jsonp(error));
    } else {
        res.status(401).jsonp({ message: 'Unauthorized' });
    }
});

// GET /ficheiros
router.get('/ficheiros', auth, function(req, res) {
    if (req.user) {
        Ficheiro.list()
            .then(data => res.jsonp(data))
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

// GET /cadeiras/:_id/ficheiros/:_idFicheiro/download
router.get('/cadeiras/:_id/ficheiros/:_idFicheiro/download', auth, function(req, res) {
    Ficheiro.lookUp(req.params._idFicheiro)
        .then(data => {
            if (data) {
                res.status(200).jsonp(data)
            } else {
                res.status(404).jsonp({error: 'File not found'})
            }
        })
        .catch(error => res.status(500).jsonp(error))
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

// GET /users/docentes
router.get('/users/docentes', auth, function(req, res) {
    if (req.user) {
        User.listDocentes()
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

// GET /users/:_id/cadeiras/adicionar
router.get('/users/:_id/cadeiras/adicionar', auth, function(req, res) {
    Uc.listCadeirasSemAluno()
        .then(data => {
            let cadeiras = []
            data.forEach(uc => {
                if (!uc.inscritos.includes(req.params._id)) {
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
    console.log(req.body)
    console.log(req.body.docentes)
    const uc = {
        _id: new mongoose.Types.ObjectId(),
        numero: req.body.numero,
        titulo: req.body.titulo,
        sigla: req.body.sigla,
        docentes: req.body.docentes,
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

// POST /cadeiras/:_id/ficheiros
router.post('/cadeiras/:_id/ficheiros', auth, function(req, res) {
    if (req.user.level != 'docente' && req.user.level != 'admin') {
        res.status(401).jsonp({error: 'User not authorized'})
        return
    }
    
    const ficheiro = {
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        descricao: req.body.descricao,
        path: req.body.path,
        mimetype: req.body.mimetype,
        data: req.body.data,
        cadeira: req.params._id
    }

    Ficheiro.insert(ficheiro)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

// POST /users/:_id/cadeiras/adicionar
router.post('/users/:_id/cadeiras/adicionar', auth, function(req, res) {
    if (req.user.level != 'aluno') {
        res.status(401).jsonp({error: 'User not authorized'})
        return
    }
    User.addCadeira(req.params._id, req.body.cadeira)
        .then(data => {
            Uc.addInscrito(req.body.cadeira, req.params._id)
                .then(data => res.jsonp(data))
                .catch(error => res.status(500).jsonp(error))
        })
        .catch(error => res.status(500).jsonp(error))
});

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

// PUT /users/:_id/cadeiras/remove
router.put('/users/:_id/cadeiras/remove', auth, function(req, res) {
    Uc.removerAluno(req.params._id)
        .then(data => {
            res.status(201).jsonp(data)
        })
        .catch(error => res.status(500).jsonp(error))
});

// PUT /cadeiras/:_id/alunos/:_idAluno/remove
router.put('/cadeiras/:_id/alunos/:_idAluno/remove', auth, function(req, res) {
    Uc.removeInscrito(req.params._id, req.params._idAluno)
        .then(data => {
            User.removeCadeira(req.params._idAluno, req.params._id)
                .then(data => res.jsonp(data))
                .catch(error => res.status(500).jsonp(error))
        })
        .catch(error => res.status(500).jsonp(error))
});

// DELETE /cadeiras/:_id/delete
router.delete('/cadeiras/:_id/delete', auth, function(req, res) {
    if (req.user.level != 'docente' && req.user.level != 'admin') {
        res.status(401).jsonp({error: 'User not authorized'})
        return
    }
    Uc.lookUp(req.params._id)
        .then(uc => {
            if (uc.docentes[0] === req.user._id || req.user.level === 'admin') {
                Uc.remove(req.params._id)
                    .then(data => res.jsonp(data))
                    .catch(error => res.status(500).jsonp(error))
            }
        })
        .catch(error => res.status(500).jsonp('Error: Cadeira not found'))
});

// DELETE /cadeiras/:_id/ficheiros/:_idFicheiro
router.delete('/cadeiras/:_id/ficheiros/:_idFicheiro', auth, function(req, res) {
    if (req.user.level != 'docente' && req.user.level != 'admin') {
        res.status(401).jsonp({error: 'User not authorized'})
        return
    }
    Ficheiro.remove(req.params._idFicheiro)
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).jsonp(error))
});

module.exports = router;
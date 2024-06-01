var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var fs = require('fs');
var multer = require('multer');
var axios = require('axios');
var API = require('../controllers/API');
var Auth = require('../controllers/Auth');

var upload = multer({ dest: 'uploads/' });

// GET /login
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login'});
});

// GET /register
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register'});
});

// GET /logout
router.get('/logout', function (req, res, next) {
  res.clearCookie('token')
  res.redirect('/login')
});

// GET perfil
router.get('/perfil', Auth.auth, function(req, res, next) {
  if (!req.idUser || !req.cookies.token) {
    return res.render('error', { error: 'User ID or token is missing' });
  }

  const userData = API.getUserData(req.idUser, req.cookies.token);
  const userCadeiras = API.getCadeirasUser(req.idUser, req.nivel, req.cookies.token);

  Promise.all([userData, userCadeiras])
    .then(([userData, userCadeiras]) => {
      res.render('perfilPage', { title: 'Perfil', user: userData.data, cadeiras: userCadeiras, nivel: req.nivel });
    })
    .catch(erro => res.render('error', { error: erro }));
});

// GET /perfil/update
router.get('/perfil/update', Auth.auth, function(req, res, next) {
  API.getUserData(req.idUser, req.cookies.token)
    .then(dados => res.render('perfilUpdateForm', {title: 'Editar perfil', user: dados.data}))
    .catch(erro => res.render('error', {error: erro}))
});

// GET /cadeiras
router.get('/cadeiras', Auth.auth, function(req, res, next) {
  API.getCadeirasUser(req.idUser, req.nivel, req.cookies.token)
    .then(dados => {
      res.render('cadeirasList', {title: 'Cadeiras', cadeiras: dados, nivel: req.nivel})
    })
    .catch(erro => res.render('error', {error: erro}))
});

// GET /cadeiras/add (docentes/admin)
router.get('/cadeiras/add', Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin' || req.nivel === 'docente') {
    res.render('cadeiraAddForm', {title: 'Adicionar Cadeira', nivel: req.nivel})
  }
});

// GET /cadeiras/:_id/update (docentes/admin)
router.get('/cadeiras/:_id/update', Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin' || req.nivel === 'docente') {
    API.getCadeira(req.params._id, req.cookies.token)
    .then(({ cadeiraData, docentesData }) => {
          const docentes = cadeiraData.docentes.join(', ')
          const horarioT = cadeiraData.horario.teoricas.join(', ')
          const horarioP = cadeiraData.horario.praticas.join(', ')
          const avaliacao = cadeiraData.avaliacao.join(', ')
          res.render('cadeiraUpdateForm', { title: cadeiraData.titulo, cadeira: cadeiraData, docentes: docentes, horarioT: horarioT, horarioP: horarioP, avaliacao, avaliacao, nivel: req.nivel, userID: req.idUser });
      })
      .catch(erro => res.render('error', {error: erro}))
  }
});

// GET /cadeiras/:_id
router.get('/cadeiras/:_id', Auth.auth, function(req, res, next) {
  API.getCadeira(req.params._id, req.cookies.token)
      .then(({ cadeiraData, docentesData }) => {
          res.render('cadeiraHomePage', { title: cadeiraData.titulo, cadeira: cadeiraData, docentes: docentesData, nivel: req.nivel, userID: req.idUser });
      })
      .catch(erro => res.render('error', { error: erro }));
});

// GET /cadeiras/:_id/sumario/add (docentes)
router.get('/cadeiras/:_id/sumario/add', Auth.auth, function(req, res, next) {
  if (req.nivel === 'docente') {
    API.getCadeira(req.params._id, req.cookies.token)
      .then(({ cadeiraData, docentesData }) => {
        res.render('sumarioAddForm', {title: 'Adicionar Sumário', cadeira: cadeiraData, nivel: req.nivel})
      })
      .catch(erro => res.render('error', {error: erro}))
  }
});

// GET /cadeiras/:_id/alunos
router.get('/cadeiras/:_id/alunos', Auth.auth, function(req, res, next) {
  API.listAlunos(req.params._id, req.cookies.token)
    .then(dados => res.render('cadeiraAlunos', {alunos: dados}))
    .catch(erro => res.render('error', {error: erro}))
});

// GET /users/:_id
router.get('/users/:_id', Auth.auth, function(req, res, next) {
  const userData = API.getUserData(req.idUser, req.cookies.token);
  const userCadeiras = API.getCadeirasUser(req.idUser, req.nivel, req.cookies.token);

  Promise.all([userData, userCadeiras])
    .then(([userData, userCadeiras]) => {
      res.render('perfilPage', { title: 'Perfil', user: userData.data, cadeiras: userCadeiras, nivel: req.nivel });
    })
    .catch(erro => res.render('error', { error: erro }));
});

// GET /cadeiras/:_id/ficheiros

// GET /cadeiras/:_id/ficheiros/:_idFicheiro

// POST /login
router.post('/login', function(req, res, next) {
  axios.post('http://localhost:7778/users/login', req.body)
    .then(response => {
      res.cookie('token', response.data.token)
      res.redirect('/cadeiras')
    
    })
    .catch(erro => {
      res.render('error', {error: erro})
    })
});

// POST /register
router.post('/register', function(req, res, next) {
  axios.post('http://localhost:7778/users/register', req.body)
    .then(response => {
      res.cookie('token', response.data.token)
      res.redirect('/login')
    })
    .catch(erro => {
      res.render('error', {error: erro})
    })
});

// POST /perfil/update/:_id
router.post('/perfil/update/:_id', Auth.auth, function(req, res, next) {
  API.updateUserData(req.params._id, req.body, req.cookies.token)
    .then(dados => res.redirect('/perfil'))
    .catch(erro => res.render('error', {error: erro}))
});

// POST /cadeiras/add (docentes/admin)
router.post('/cadeiras/add', Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin' || req.nivel === 'docente') {
    API.addCadeira(req.body, req.cookies.token)
      .then(dados => res.redirect('/cadeiras'))
      .catch(erro => res.render('error', {error: erro}))
  }
});

// POST /cadeiras/:_id/sumario/add (docentes)
router.post('/cadeiras/:_id/sumario/add', Auth.auth, function(req, res, next) {
  if (req.nivel === 'docente') {
    API.addSumario(req.params._id, req.body, req.cookies.token)
      .then(dados => res.redirect(`/cadeiras/${req.params._id}`))
      .catch(erro => res.render('error', {error: erro}))
  }
});

// POST /cadeiras/:_id/update
router.post('/cadeiras/:_id/update', Auth.auth, function(req, res, next) {
  req.body.docentes = req.body.docentes.split(',')
  req.body.horario_teoricas = req.body.horario_teoricas.split(',')
  req.body.horario_praticas = req.body.horario_praticas.split(',')
  req.body.avaliacao = req.body.avaliacao.split(',')
  API.updateCadeira(req.params._id, req.body, req.cookies.token)
    .then(dados => res.redirect(`/cadeiras/${req.params._id}`))
    .catch(erro => res.render('error', {error: erro}))
});

// POST /cadeiras/:_id/ficheiros

// PUT /cadeiras/:_id

// PUT /cadeiras/:_id/ficheiros/:_idFicheiro

// DELETE /cadeiras/:_id
router.delete('/cadeiras/:_id', Auth.auth, function(req, res, next) {
  if (req.isAdmin || req.isDocente) {
    API.deleteCadeira(req.params._id, req.cookies.token)
      .then(dados => {
        if (req.isAdmin) {
          res.redirect('/cadeiras')
        } else {
          res.redirect(`/cadeiras/${req.idUser}`)
        }
      })
      .catch(erro => res.render('error', {error: erro}))
  }
});

// DELETE /cadeiras/:_id/ficheiros/:_idFicheiro

module.exports = router;

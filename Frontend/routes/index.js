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
router.get('/perfil/:_id', Auth.auth, function(req, res, next) {
  API.getUserData(req.idUser, req.cookies.token)
    .then(dados =>{
      if (dados.nivel == 'admin') {
        res.render('perfilAdmin', {user: dados})
      } else if (dados.nivel == 'docente') {
        res.render('perfilDocente', {user: dados})
      } else {
        res.render('perfilAluno', {user: dados})
      }
    })
    .catch(erro => res.render('error', {error: erro}))
});

// GET /cadeiras (admin)
router.get('/cadeiras', Auth.isAdmin, function(req, res, next) {
  API.listCadeiras(req.cookies.token)
    .then(dados => res.render('cadeirasListAdmin', {cadeiras: dados}))
    .catch(erro => res.render('error', {error: erro}))
});

// GET /cadeiras/add (docentes/admin)
router.get('/cadeiras/add', Auth.auth, function(req, res, next) {
  if (req.isAdmin || req.isDocente) {
    res.render('cadeiraAddForm', {title: 'Adicionar Cadeira'})
  }
});

// GET /cadeiras/update (docentes/admin)
router.get('/cadeiras/:_id/update', Auth.auth, function(req, res, next) {
  if (req.isAdmin || req.isDocente) {
    API.getCadeira(req.params._id, req.cookies.token)
      .then(dados => res.render('cadeiraUpdateForm', {cadeira: dados}))
      .catch(erro => res.render('error', {error: erro}))
  }
});

// GET /cadeiras/:_id
router.get('/cadeiras/:_id', Auth.auth, function(req, res, next) {
  API.getCadeira(req.params._id, req.cookies.token)
    .then(dados => res.render('cadeiraHomePage', {cadeira: dados}))
    .catch(erro => res.render('error', {error: erro}))
});

// GET /cadeiras/:_id/alunos
router.get('/cadeiras/:_id/alunos', Auth.auth, function(req, res, next) {
  API.listAlunos(req.params._id, req.cookies.token)
    .then(dados => res.render('cadeiraAlunos', {alunos: dados}))
    .catch(erro => res.render('error', {error: erro}))
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

// POST /cadeiras

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

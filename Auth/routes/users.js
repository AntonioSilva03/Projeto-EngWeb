var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/user')
var auth = require('../auth/auth') // isAdmin, verify

var User = require('../controllers/user')

// GET /
router.get('/', auth.isAdmin, function (req, res) {
  User.list()
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(erro => res.status(500).jsonp({error: erro}))
});

// GET /:_id
router.get('/:_id', auth.verify, function (req, res) {
  User.lookUp(req.params._id)
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(erro => res.status(500).jsonp({error: erro}))
});

// POST /register
router.post('/register', function(req, res) {
  const newUser = new userModel({ 
    _id: new mongoose.Types.ObjectId(),
    numero: Math.floor(Math.random() * 1000000).toString(),
    nome: req.body.nome, 
    email: req.body.email,
    nivel: req.body.nivel,
    ano: "",
    foto: "",
    filiacao: req.body.filiacao,
    categoria: req.body.categoria,
    webpage: req.body.webpage,
    cursos: [],
    cadeiras: []
  });

  userModel.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.error("Registration error:", err);
      return res.status(409).jsonp({ error: err, message: "Register error: " + err });
    }

    else {
      res.status(201).jsonp({ message: "User registered successfully" });
    }
  });
});

// POST /login
router.post('/login', passport.authenticate('local'), function(req, res) {
  var user_level = User.getUserLevel(req.user.email)
  jwt.sign({
    email: req.user.email, 
    level: user_level, 
    sub: 'EW'}, 
    "EW2024",
    {expiresIn: 3600},
    function(e, token) {
      if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
      else res.status(201).jsonp({token: token})
    });
});

// PUT /:_id
router.put('/:_id', auth.verify, function (req, res) {
  User.update(req.params._id, req.body)
    .then(dados => res.status(200).jsonp({dados}))
    .catch(erro => res.status(500).jsonp({error: erro}))
});

// PUT /:_id/password
router.put('/:_id/password', auth.verify, function (req, res) {
  User.updatePassword(req.params._id, req.body)
    .then(dados => res.status(200).jsonp({dados}))
    .catch(erro => res.status(500).jsonp({error: erro}))
});

// DELETE /:_id
router.delete('/:_id', auth.verify, function (req, res) {
  User.remove(req.params._id)
    .then(dados => res.status(200).jsonp({dados}))
    .catch(erro => res.status(500).jsonp({error: erro}))
});

module.exports = router;

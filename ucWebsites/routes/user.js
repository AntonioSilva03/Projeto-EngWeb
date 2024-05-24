var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var auth = require('../auth/auth')

// users list
router.get('/', auth.isAdmin, function(req, res, next) {
    res.render('users', { title: 'Users' });
});

// pagina login
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

// pagina registo
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register' });
});

// registar 
router.post('/register', function(req, res){
})
  
// login
router.post('/login', passport.authenticate('local'), function(req, res){
    const { email, password } = req.body
    
})
  
  module.exports = router;
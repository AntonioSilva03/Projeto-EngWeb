var express = require('express');
var router = express.Router();

var Estudante = require('../controllers/estudante');

// GET lista de estudantes
router.get('/', function(req, res) {
    Estudante.list()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
});

// GET estudante por id
router.get('/:id', function(req, res) {
    Estudante.lookUp(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
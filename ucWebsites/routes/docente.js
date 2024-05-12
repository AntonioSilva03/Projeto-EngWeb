var express = require('express');
var router = express.Router();

var Docente = require('../controllers/docente');

// GET lista de docentes
router.get('/', function(req, res) {
    Docente.list()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
});

// GET docente por id
router.get('/:id', function(req, res) {
    Docente.lookUp(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
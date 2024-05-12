var express = require('express');
var router = express.Router();

var UC = require('../controllers/uc');

// GET lista de ucs
router.get('/', function(req, res) {
    UC.list()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
});

// GET uc por id
router.get('/:id', function(req, res) {
    UC.lookUp(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
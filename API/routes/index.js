var express = require('express');
var router = express.Router();
var UC = require('../controllers/uc');
var User = require('../controllers/user');
var jwt = require('jsonwebtoken')
var multer = require('multer')
const upload = multer({ dest: 'uploads/' })
var fs = require('fs')

// GET /cadeiras (do user)

// GET /cadeiras/:_id

// GET /cadeiras/:_id/alunos

// GET /cadeiras/:_id/ficheiros

// GET /cadeiras/:_id/ficheiros/:_id

// POST /cadeiras/:_id/ficheiros

// DELETE /cadeiras/:_id/ficheiros/:_id

module.exports = router;
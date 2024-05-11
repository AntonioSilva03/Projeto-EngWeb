var mongoose = require('mongoose');

var estudanteSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    email: String,
    password: String,
    nivel: String, // admin, estudante, docente
    curso: String,
    ano: Number,
    foto: String,
    cadeiras: [String]
}, {versionKey : false});

module.exports = mongoose.model('estudante', estudanteSchema);
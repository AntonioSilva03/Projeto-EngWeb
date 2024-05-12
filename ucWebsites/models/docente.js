var mongoose = require('mongoose');

var docenteSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    email: String,
    password: String,
    nivel: String, // admin, estudante, docente
    filiacao: String,
    categortia: String,
    foto: String,
    cursos: [String],
    cadeiras: [String]
}, {versionKey : false});

module.exports = mongoose.model('docente', docenteSchema);
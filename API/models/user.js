var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    email: String,
    password: String,
    nivel: String, // admin, estudante, docente
    ano: Number,
    foto: String,
    filiacao: String,
    categortia: String,
    webpage: String,
    cursos: [String],
    cadeiras: [String]
}, {versionKey : false});

module.exports = mongoose.model('user', userSchema);
const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    numero: String,
    nome: String,
    email: String,
    nivel: String, // admin, aluno, docente
    ano: Number,
    foto: String,
    filiacao: String,
    categoria: String,
    webpage: String,
    cursos: [String],
    cadeiras: [String]
}, { collection: 'users' });

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
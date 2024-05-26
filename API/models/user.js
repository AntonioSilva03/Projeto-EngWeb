var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

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

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);
var mongoose = require('mongoose');

var ficheiroSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: String,
    descricao: String,
    path: String,
    mimetype: String,
    data: String,
    cadeira: String, // _id da cadeira
}, {versionKey : false});

module.exports = mongoose.model('ficheiro', ficheiroSchema);
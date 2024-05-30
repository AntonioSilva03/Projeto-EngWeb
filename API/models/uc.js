var mongoose = require('mongoose');

var ucSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    numero: String,
    titulo: String,
    sigla: String,
    ano: Number,
    docentes: [String], // lista de ids de docentes (1º é o regente)
    inscritos: [String], // lista de ids de estudantes
    horario: {
        teoricas: [String], 
        praticas: [String]
    },
    avaliacao: [String],
    datas: {
        teste: String,
        exame: String,
        projeto: String
    },
    aulas: [{
        tipo: String, // T ou P
        data: String,
        sumario: [String]
    }]
}, {versionKey : false});

module.exports = mongoose.model('uc', ucSchema);
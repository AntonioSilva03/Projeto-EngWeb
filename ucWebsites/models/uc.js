var mongoose = require('mongoose');

var ucSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    sigla: String,
    codigo: String,
    descricao: String,
    docente: String,
    ano: Number,
    semestre: Number,
    curso: String,
    docentes: [String], // lista de ids de docentes (1º é o regente)
    inscritos: [String], // lista de ids de estudantes
    horario: [{
        tipoAula: String, // teorica, pratica, laboratorial
        dia: String,
        horaInicio: String,
        horaFim: String,
        edificio: String,
        sala: String
    }],
    avalicao: [{
        tipo: String, // teste, exame, projeto, ...
        peso: Number,
        data: String,
    }]
}, {versionKey : false});

module.exports = mongoose.model('uc', ucSchema);
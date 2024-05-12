var Docente = require('../models/docente');

// listar todos os docentes (ordenados por nome)
module.exports.list = () => {
    return Docente
        .find()
        .sort({nome: 1})
        .exec()
};

// consultar um docente por id
module.exports.lookUp = id => {
    return Docente
        .findOne({_id: id})
        .exec()
};

// inserir um docente
module.exports.insert = docente => {
    return Docente.create(docente)
};

// remover um docente por id
module.exports.remove = id => {
    return Docente.delete({_id: id})
};

// atualizar um docente por id
module.exports.update = (id, docente) => {
    return Docente.findByIdAndUpdate(id, docente)
};

// listar cadeiras de um docente
module.exports.listCadeiras = id => {
    return Docente
        .findOne({_id: id})
        .populate('cadeiras')
        .exec()
};

// listar cursos de um docente
module.exports.listCursos = id => {
    return Docente
        .findOne({_id: id})
        .populate('cursos')
        .exec()
};

// listar cadeiras de um docente
module.exports.listCadeiras = id => {
    return Docente
        .findOne({_id: id})
        .populate('cadeiras')
        .exec()
};
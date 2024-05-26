var Ficheiro = require('../models/ficheiro');

// listar todos os ficheiros
module.exports.list = () => {
    return Ficheiro
        .find()
        .sort({nome: 1})
        .exec()
};

// listar fichiros de uma cadeira
module.exports.listCadeira = _id => {
    return Ficheiro
        .find({cadeira: _id})
        .exec()
};

// consultar um ficheiro por _id
module.exports.lookUp = id => {
    return Ficheiro
        .findOne({_id: id})
        .exec()
};

// inserir um ficheiro
module.exports.insert = ficheiro => {
    return Ficheiro.create(ficheiro)
};

// remover um ficheiro por _id
module.exports.remove = id => {
    return Ficheiro.deleteOne({_id: id})
};
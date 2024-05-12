var Estudante = require('../models/estudante');

// listar todos os estudantes (ordenados por nome)
module.exports.list = () => {
    return Estudante
        .find()
        .sort({nome: 1})
        .exec()
};

// consultar um estudante por id
module.exports.lookUp = id => {
    return Estudante
        .findOne({_id: id})
        .exec()
};

// inserir um estudante
module.exports.insert = estudante => {
    return Estudante.create(estudante)
};

// remover um estudante por id
module.exports.remove = id => {
    return Estudante.deleteOne({_id: id})
};

// atualizar um estudante por id
module.exports.update = (id, estudante) => {
    return Estudante.findByIdAndUpdate(id, estudante)
};
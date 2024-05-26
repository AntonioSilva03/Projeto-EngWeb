var Uc = require('../models/uc');

// listar todas as uc (ordenadas por nome)
module.exports.list = () => {
    return Uc
        .find()
        .sort({nome: 1})
        .exec()
};

// consultar uma uc por id
module.exports.lookUp = id => {
    return Uc
        .findOne({_id: id})
        .exec()
};

// inserir uma uc
module.exports.insert = uc => {
    return Uc.create(uc)
};

// remover uma uc por id
module.exports.remove = id => {
    return Uc.deleteOne({_id: id})
};

// atualizar uma uc por id
module.exports.update = (id, uc) => {
    return Uc.updateOne.findByIdAndUpdate(id, uc)
}

// listar alunos inscritos numa uc
module.exports.listInscritos = id => {
    return Uc
        .findOne({_id: id})
        .populate('inscritos')
        .exec()
};
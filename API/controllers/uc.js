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

// remover uma uc por id (so o coordenador da uc pode remover)
module.exports.remove = (id, idDocente) => {
    return Uc.deleteOne({_id: id, 'docentes.0': idDocente})
};

// atualizar uma uc por id (so o coordenador da uc pode atualizar)
module.exports.update = (id, uc, idDocente) => {
    return Uc.updateOne({_id: id, 'docentes.0': idDocente}, uc)
}

// listar alunos inscritos numa uc
module.exports.listInscritos = id => {
    return Uc
        .findOne({_id: id})
        .populate('inscritos')
        .exec()
};
var Uc = require('../models/uc');

// listar todas as uc (ordenadas por nome)
module.exports.list = () => {
    return Uc.find().exec()
};

// consultar uma uc por id
module.exports.lookUp = id => {
    return Uc.findOne({_id: id}).exec()
};

// inserir uma uc
module.exports.insert = uc => {
    return Uc.create(uc)
};

// adicionar sumario a uma uc
module.exports.addSumario = (id, sumario) => {
    return Uc.updateOne({_id: id}, {$push: {aulas: sumario}})
};

// cadeiras onde o ID nao esta nos inscritos
module.exports.listCadeirasSemAluno = id => {
    return Uc.find({inscritos: {$ne: id}}).exec()
};

// remover uma uc por id (so o coordenador da uc pode remover)
module.exports.remove = (id) => {
    return Uc.deleteOne({_id: id})
};

// atualizar uma uc por id
module.exports.update = (id, uc,) => {
    return Uc.updateOne({_id: id}, uc)
}

// listar alunos inscritos numa uc
module.exports.listInscritos = id => {
    return Uc.findOne({_id: id}).select('inscritos').exec()
};

module.exports.addInscrito = (id, idAluno) => {
    return Uc.updateOne({_id: id}, {$addToSet: {inscritos: idAluno}})
};

module.exports.removeInscrito = (id, idAluno) => {
    return Uc.updateOne({_id: id}, {$pull: {inscritos: idAluno}})
};

module.exports.removerAluno = (idAluno) => {    
    return Uc.updateMany({inscritos: idAluno}, {$pull: {inscritos: idAluno}})
};
var User = require('../models/user')

module.exports.list = () => {
    return User.find().sort({nome: 1}).exec()
}

module.exports.listDocentes = () => {
    return User.find({nivel: 'docente'}).exec()
}

module.exports.lookUp = id => {
    return User.findOne({_id: id}).exec()
}

module.exports.insert = user => {
    return User.create(user)
}

module.exports.update = (id, user) => {
    return User.findByIdAndUpdate(id, user).exec()
}

module.exports.remove = id => {
    return User.findByIdAndRemove(id).exec()
}

module.exports.addCadeira = (id, idCadeira) => {
    return User.updateOne({_id: id}, {$addToSet: {cadeiras: idCadeira}})
}

module.exports.removeCadeira = (id, idCadeira) => {
    return User.updateOne({_id: id}, {$pull: {cadeiras: idCadeira}})
}
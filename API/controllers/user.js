var User = require('../models/user')

module.exports.list = () => {
    return User.find()
                .sort({nome: 1})  
                .exec()
}

module.exports.lookUp = id => {
    return User.findOne({_id: id})
                .exec()
}

module.exports.insert = user => {
    return User.create(user)
}

module.exports.update = (id, user) => {
    return User.findByIdAndUpdate(id, user)
                .exec()
}

module.exports.remove = id => {
    return User.findByIdAndRemove(id)
                .exec()
}


module.exports.getCadeiras = id => {
    return User.findOne({_id: id})
                .exec()
}

module.exports.getCursos = id => {
    return User.findOne({_id: id, nivel: 'docente'})
                .exec()
}

module.exports.getCursoEstudante = id => {
    return User.findOne({_id: id, nivel: 'estudante'})
                .exec()
}
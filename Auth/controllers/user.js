var User = require('../models/user')

module.exports.list = () => {
    return User.find()
                .exec()
                .sort({nome: 1})
                .then(dados => { 
                    return dados 
                })
                .catch(erro => {
                    throw new Error('Error getting users list')
                })
}

module.exports.lookUp = id => {
    return User.findOne({_id: id})
                .exec()
                .then(dados => {
                    return dados
                })
                .catch(erro => {
                    throw new Error('Error getting user')
                })
}

module.exports.insert = user => {
    return User.create(user)
                .then(dados => {
                    return dados
                })
                .catch(erro => {
                    throw new Error('Error inserting user')
                })
}

module.exports.update = (id, user) => {
    return User.findByIdAndUpdate(id, user, {new: true})
                .exec()
                .then(dados => {
                    return dados
                })
                .catch(erro => {
                    throw new Error('Error updating user')
                })
}

module.exports.updatePassword = (id, password) => {
    return User.updateOne({_id: id}, password)
                .then(dados => {
                    return dados
                })
                .catch(erro => {
                    throw new Error('Error updating password')
                })
}

module.exports.remove = id => {
    return User.deleteOne({_id: id})
                .then(dados => {
                    return dados
                })
                .catch(erro => {
                    throw new Error('Error removing user')
                })
}
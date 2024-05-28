const axios = require('axios');

module.exports.getUserData = (_id, token) => {
    return axios.get(`http://localhost:7777/users/${_id}?token=${token}`)
        .then(dados => { return dados.data })
        .catch(erro => { throw erro })
}

module.exports.getCadeirasUser = (_id, token) => {
    return axios.get(`http://localhost:7777/users/${_id}/cadeiras?token=${token}`)
        .then(dados => { return dados.data })
        .catch(erro => { throw erro })
}

module.exports.getCadeira = (_idCadeira, token) => {
    return axios.get(`http://localhost:7777/cadeiras/${_idCadeira}?token=${token}`)
        .then(dados => { return dados.data })
        .catch(erro => { throw erro })
}   

module.exports.listCadeiras = (token) => {
    return axios.get(`http://localhost:7777/cadeiras?token=${token}`)
        .then(dados => { return dados.data })
        .catch(erro => { throw erro })
}

module.exports.listAlunos = (_id, token) => {
    return axios.get(`http://localhost:7777/cadeiras/${_id}/alunos?token=${token}`)
        .then(dados => { return dados.data })
        .catch(erro => { throw erro })
}

module.exports.deleteCadeira = (_id, token) => {
    return axios.delete(`http://localhost:7777/cadeiras/${_id}?token=${token}`)
        .then(dados => { return dados.data })
        .catch(erro => { throw erro })
}
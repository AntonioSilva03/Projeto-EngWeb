const axios = require('axios');

module.exports.getUserData = (userID, token) => {
    return axios.get(`http://localhost:7779/users/${userID}?token=${token}`)
        .then(dados => { return dados })
        .catch(erro => { throw erro })
}

module.exports.updateUserData = (userID, data, token) => {
    const updateUserPromise = axios.put(`http://localhost:7779/users/${userID}?token=${token}`, data);
    
    // Auth server
    const updatePasswordPromise = axios.post(`http://localhost:7778/users/password?token=${token}`, data);

    // Wait for both requests to complete
    return Promise.all([updateUserPromise, updatePasswordPromise])
        .then(responses => {
            const [userDataResponse, passwordResponse] = responses;
            return { userData: userDataResponse.data, passwordResponse: passwordResponse.data };
        })
        .catch(error => {
            throw error;
        });
}

module.exports.getCadeirasUser = (userID, token) => {
    return axios.get(`http://localhost:7779/users/${userID}/cadeiras?token=${token}`)
        .then(dados => { return dados })
        .catch(erro => { throw erro })
}

module.exports.getCadeira = (_idCadeira, token) => {
    return axios.get(`http://localhost:7779/cadeiras/${_idCadeira}?token=${token}`)
        .then(dados => { return dados })
        .catch(erro => { throw erro })
}   

module.exports.listCadeiras = (token) => {
    return axios.get(`http://localhost:7779/cadeiras?token=${token}`)
        .then(dados => { return dados })
        .catch(erro => { throw erro })
}

module.exports.listAlunos = (_id, token) => {
    return axios.get(`http://localhost:7779/cadeiras/${_id}/alunos?token=${token}`)
        .then(dados => { return dados })
        .catch(erro => { throw erro })
}

module.exports.deleteCadeira = (_id, token) => {
    return axios.delete(`http://localhost:7779/cadeiras/${_id}?token=${token}`)
        .then(dados => { return dados })
        .catch(erro => { throw erro })
}
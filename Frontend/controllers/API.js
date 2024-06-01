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

module.exports.getCadeirasUser = (userID, nivel, token) => {
    if (nivel === 'docente') { 
        return axios.get(`http://localhost:7779/cadeiras?token=${token}`)
            .then(dados => { 
                cadeiras_docentes = []
                for (let i = 0; i < dados.data.length; i++) {
                    if (dados.data[i].docentes.includes(userID)) {
                        cadeiras_docentes.push(dados.data[i])
                    }
                }

                return cadeiras_docentes
            })

            .catch(erro => { throw erro })
    }

    if (nivel === 'aluno') {
        return axios.get(`http://localhost:7779/cadeiras?token=${token}`)
            .then(dados => {
                cadeiras_aluno = []
                for (let i = 0; i < dados.data.length; i++) {
                    for (let j = 0; j < dados.data[i].inscritos.length; j++) {
                        if (dados.data[i].inscritos[j] === userID) {
                            cadeiras_aluno.push(dados.data[i])
                        }
                    }
                }

                return cadeiras_aluno
            })

            .catch(erro => { throw erro })
    }


    if (nivel === 'admin') {
        return axios.get(`http://localhost:7779/cadeiras?token=${token}`)
            .then(dados => { return dados.data })
            .catch(erro => { throw erro })
    }
}

module.exports.getCadeira = async (_idCadeira, token) => {
    try {
        const cadeiraResponse = await axios.get(`http://localhost:7779/cadeiras/${_idCadeira}?token=${token}`);
        const cadeiraData = cadeiraResponse.data;

        const docentesResponse = await axios.get(`http://localhost:7779/users?token=${token}`);
        const docentesData = docentesResponse.data;

        const docente_cadeira = [];
        
        for (let i = 0; i < docentesData.length; i++) {
            id_docente = docentesData[i]._id;
            for (let j = 0; j < cadeiraData.docentes.length; j++) {
                if (id_docente === cadeiraData.docentes[j]) {
                    docente_cadeira.push(docentesData[i]);
                }
            }
        }

        return { cadeiraData: cadeiraData, docentesData: docente_cadeira };
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

module.exports.addSumario = (idCadeira, data, token) => {
    return axios.post(`http://localhost:7779/cadeiras/${idCadeira}/sumarios?token=${token}`, data)
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

module.exports.addCadeira = (data, token) => {
    return axios.post(`http://localhost:7779/cadeiras?token=${token}`, data)
        .then(dados => { return dados })
        .catch(erro => { throw erro })
}

module.exports.updateCadeira = (_id, data, token) => {
    return axios.post(`http://localhost:7779/cadeiras/${_id}/update?token=${token}`, data)
        .then(dados => { return dados })
        .catch(erro => { throw erro })
}

module.exports.deleteCadeira = (_id, token) => {
    return axios.delete(`http://localhost:7779/cadeiras/${_id}?token=${token}`)
        .then(dados => { return dados })
        .catch(erro => { throw erro })
}
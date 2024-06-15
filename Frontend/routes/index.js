var express = require('express');
var router = express.Router();
var path = require('path'); 
var jsonfile = require('jsonfile');
var fs = require('fs');
var multer = require('multer');
var axios = require('axios');
var API = require('../controllers/API');
var Auth = require('../controllers/Auth');
const zip = require('express-zip');

var upload = multer({ dest: 'uploads/' });

// GET /downloadall
router.get('/downloadall', Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin') {
    // obter todos os users
    API.listAllUsers(req.cookies.token)
      .then(usersData => {
        // obter todas as cadeiras
        API.listCadeiras(req.cookies.token)
          .then(cadeirasData => {
            // obter todos os ficheiros
            API.listAllFiles(req.cookies.token)
              .then(ficheirosData => {
                // criar um ficheiro JSON com todos os dados
                const data = {
                  users: usersData.data,
                  cadeiras: cadeirasData.data,
                  ficheiros: ficheirosData.data
                };

                const filePath = path.join(__dirname, '/../public/fileStore/', 'data.json');
                jsonfile.writeFile(filePath, data, { spaces: 2 }, (err) => {
                  if (err) {
                    console.error('Error writing JSON file:', err);
                    return res.render('error', { error: err });
                  }
                });

                const zip = [
                  {path: filePath, name: 'data.json'}
                ];

                // adicionar os ficheiros da filestore ao zip
                ficheirosData.data.forEach(ficheiro => {
                  zip.push({path: ficheiro.path, name: ficheiro.nome});
                });

                res.zip(zip, 'app_data.zip');
              })
              .catch(erro => res.render('error', { error: erro }));
          })
          .catch(erro => res.render('error', { error: erro }));
        
      })
      .catch(erro => res.render('error', { error: erro }));
  }
});

// GET /login
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login'});
});

// GET /register
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register'});
});

// GET /logout
router.get('/logout', function (req, res, next) {
  res.clearCookie('token')
  res.redirect('/login')
});

// GET perfil
router.get('/perfil', Auth.auth, function(req, res, next) {
  if (!req.idUser || !req.cookies.token) {
    return res.render('error', { error: 'User ID or token is missing' });
  }

  const userData = API.getUserData(req.idUser, req.cookies.token);
  const userCadeiras = API.getCadeirasUser(req.idUser, req.nivel, req.cookies.token);

  Promise.all([userData, userCadeiras])
    .then(([userData, userCadeiras]) => {
      res.render('perfilPage', { title: 'Perfil', user: userData.data, cadeiras: userCadeiras, nivel: req.nivel, userID: req.idUser});
    })
    .catch(erro => res.render('error', { error: erro }));
});

// GET /perfil/update
router.get('/perfil/update/:_id', Auth.auth, function(req, res, next) {
  API.getUserData(req.params._id, req.cookies.token)
    .then(dados => res.render('perfilUpdateForm', {title: 'Editar perfil', user: dados.data, nivel: req.nivel, userID: req.idUser}))
    .catch(erro => res.render('error', {error: erro}))
});

// GET /perfil/:_id/delete
router.get('/perfil/delete/:_id', Auth.auth, function(req, res, next) {
  API.getUserData(req.params._id, req.cookies.token)
    .then(dados => {
      res.render('deleteProfile', {title: 'Apagar Conta', userID: req.idUser, nivel: req.nivel, user: dados.data})
    })
    .catch(erro => res.render('error', {error: erro}))
});

// GET /cadeiras
router.get('/cadeiras', Auth.auth, function(req, res, next) {
  API.getCadeirasUser(req.idUser, req.nivel, req.cookies.token)
    .then(dados => {
      console.log(dados.data)
      res.render('cadeirasList', {title: 'Cadeiras', cadeiras: dados, nivel: req.nivel, userID: req.idUser})
    })
    .catch(erro => res.render('error', {error: erro}))
});

// GET /cadeiras/add (docentes/admin)
router.get('/cadeiras/add', Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin' || req.nivel === 'docente') {
    API.listDocentes(req.cookies.token)
      .then(dados => {
        res.render('cadeiraAddForm', {title: 'Adicionar Cadeira', docentes: dados.data, nivel: req.nivel, userID: req.idUser})
      })
      .catch(erro => res.render('error', {error: erro}))
  }
});

// GET /cadeiras/:_id/update (docentes/admin)
router.get('/cadeiras/:_id/update', Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin' || req.nivel === 'docente') {
    API.getCadeira(req.params._id, req.cookies.token)
    .then(({ cadeiraData, docentesData }) => {
          const horarioT = cadeiraData.horario.teoricas.join(', ')
          const horarioP = cadeiraData.horario.praticas.join(', ')
          const avaliacao = cadeiraData.avaliacao.join(', ')
          API.listDocentes(req.cookies.token)
            .then(docentesData => {
              res.render('cadeiraUpdateForm', { title: cadeiraData.titulo, cadeira: cadeiraData, docentes: docentesData.data, horarioT: horarioT, horarioP: horarioP, avaliacao, avaliacao, nivel: req.nivel, userID: req.idUser });
            })
            .catch(erro => res.render('error', { error: erro }));
      })
      .catch(erro => res.render('error', {error: erro}))
  }
});

// GET /cadeiras/:_id
router.get('/cadeiras/:_id', Auth.auth, function(req, res, next) {
  API.getCadeira(req.params._id, req.cookies.token)
      .then(({ cadeiraData, docentesData }) => {
          res.render('cadeiraHomePage', { title: cadeiraData.titulo, cadeira: cadeiraData, docentes: docentesData, nivel: req.nivel, userID: req.idUser });
      })
      .catch(erro => res.render('error', { error: erro }));
});

// GET /cadeiras/:_id/ficheiros
router.get('/cadeiras/:_id/ficheiros', Auth.auth, function(req, res, next) {
  if (req.idUser) {
    API.getCadeira(req.params._id, req.cookies.token)
      .then(({ cadeiraData, docentesData }) => {
        API.ficheirosCadeira(req.params._id, req.cookies.token)
          .then(ficheirosData =>
            res.render('cadeiraFicheiros', { title: 'Ficheiros', cadeira: cadeiraData, ficheiros: ficheirosData.data, nivel: req.nivel, userID: req.idUser })
          )
          .catch(erro => res.render('error', { error: erro }));
      })
      .catch(erro => res.render('error', { error: erro }));
  }
});

// GET /cadeiras/:_id/ficheiros/upload
router.get('/cadeiras/:_id/ficheiros/upload', Auth.auth, function(req, res, next) {
  API.getCadeira(req.params._id, req.cookies.token)
    .then(({ cadeiraData, docentesData }) => {
      res.render('cadeiraFileUpload', { title: 'Upload Ficheiro', cadeira: cadeiraData, nivel: req.nivel, userID: req.idUser })
    })
    .catch(erro => res.render('error', {error: erro}))
});

// GET /cadeiras/:_id/ficheiros/:_idFicheiro/download
router.get('/cadeiras/:_id/ficheiros/:_idFicheiro/download', Auth.auth, function(req, res, next) {
  API.getFile(req.params._id, req.params._idFicheiro, req.cookies.token)
    .then(dados => {
      const file = dados.data;
      const filePath = path.join(__dirname, '/../public/fileStore/', file.nome);
      res.download(filePath, file.nome);
    })
    .catch(erro => res.render('error', { error: erro }));
});

// GET /cadeiras/:_id/ficheiros/:_idFicheiro/delete
router.get('/cadeiras/:_id/ficheiros/:_idFicheiro/delete', Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin' || req.nivel === 'docente') {
    API.deleteFile(req.params._id, req.params._idFicheiro, req.cookies.token)
      .then(dados => res.redirect(`/cadeiras/${req.params._id}/ficheiros`))
      .catch(erro => res.render('error', { error: erro }));
  }
});

// GET /cadeiras/:_id/sumario/add (docentes)
router.get('/cadeiras/:_id/sumario/add', Auth.auth, function(req, res, next) {
  if (req.nivel === 'docente') {
    API.getCadeira(req.params._id, req.cookies.token)
      .then(({ cadeiraData, docentesData }) => {
        res.render('sumarioAddForm', {title: 'Adicionar Sumário', cadeira: cadeiraData, nivel: req.nivel, userID: req.idUser})
      })
      .catch(erro => res.render('error', {error: erro}))
  }
});

// GET /cadeiras/:_id/alunos
router.get('/cadeiras/:_id/alunos', Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin' || req.nivel === 'docente') {
    API.getCadeira(req.params._id, req.cookies.token)
      .then(({ cadeiraData, docentesData }) => {
        API.listAlunos(req.params._id, req.cookies.token)
          .then(alunosData =>{
            console.log(alunosData.data)
            res.render('cadeiraAlunos', { title: 'Alunos', cadeira: cadeiraData, alunos: alunosData.data, nivel: req.nivel, userID: req.idUser})
      })
          .catch(erro => res.render('error', { error: erro }));
      })
      .catch(erro => res.render('error', { error: erro }));
  }
});

// GET /cadeiras/:_id/alunos/:_idAluno/remove
router.get('/cadeiras/:_id/alunos/:_idAluno/remove', Auth.auth, function(req, res, next) {
  API.removeAlunoCadeira(req.params._id, req.params._idAluno, req.cookies.token)
    .then(dados => {
      if (req.nivel === 'aluno') res.redirect('/cadeiras')
      else res.redirect(`/cadeiras/${req.params._id}/alunos`)
    })
    .catch(erro => res.render('error', { error: erro }));
});

// GET /users/:_id/cadeiras/adicionar
router.get('/users/:_id/cadeiras/adicionar', Auth.auth, function(req, res, next) {
  if (req.nivel === 'aluno') {
    API.cadeirasSemAluno(req.idUser, req.cookies.token)
      .then(dados => {
        res.render('alunoAddCadeira', { title: 'Adicionar Cadeira', cadeiras: dados.data, nivel: req.nivel, userID: req.idUser})
      })
      .catch(erro => res.render('error', { error: erro }))
  }
});

// GET /users/:_id
router.get('/users/:_id', Auth.auth, function(req, res, next) {
  API.getUserData(req.params._id, req.cookies.token)
    .then(response => {
      API.getCadeirasUser(req.params._id, response.data.nivel, req.cookies.token)
        .then(dados => {
          res.render('perfilPage', { title: response.data.nome, user: response.data, cadeiras: dados, nivel: req.nivel, userID: req.idUser })
        })
        .catch(erro => res.render('error', { error: erro }))
    })
    .catch(erro => res.render('error', { error: erro }))
});

// POST /login
router.post('/login', function(req, res, next) {
  axios.post(`${process.env.AUTH}/login`, req.body)
    .then(response => {
      res.cookie('token', response.data.token)
      res.redirect('/cadeiras')
    
    })
    .catch(erro => {
      console.log(erro)
      res.render('login', {message: 'Credenciais inválidas'})
    })
});

// POST /register
router.post('/register', function(req, res, next) {
  if (req.body.nivel === 'admin') {
    res.render('register', {message: 'Não é possível registar como administrador'})
  } else {
    axios.post(`${process.env.AUTH}/register`, req.body)
      .then(response => {
        res.cookie('token', response.data.token)
        res.redirect('/login')
      })
      .catch(erro => {
        res.render('error', {error: erro})
      })
  }
});

// POST /perfil/update/:_id
router.post('/perfil/update/:_id', Auth.auth, function(req, res, next) {
  API.updateUserData(req.params._id, req.body, req.cookies.token)
    .then(dados => res.redirect('/perfil'))
    .catch(erro => res.render('error', {error: erro}))
});

// POST /cadeiras/add (docentes/admin)
router.post('/cadeiras/add', Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin' || req.nivel === 'docente') {
    API.addCadeira(req.body, req.cookies.token)
      .then(dados => res.redirect('/cadeiras'))
      .catch(erro => res.render('error', {error: erro}))
  }
});

// POST /cadeiras/:_id/ficheiros/upload
router.post('/cadeiras/:_id/ficheiros/upload', upload.single('ficheiro'), Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin' || req.nivel === 'docente') {
    const oldPath = req.file.path;
    const newPath = path.join(__dirname, '/../public/fileStore/', req.file.originalname);

    console.log(`Old Path: ${oldPath}`);
    console.log(`New Path: ${newPath}`);

    const destDir = path.dirname(newPath);
    fs.mkdirSync(destDir, { recursive: true });

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error('File moving error:', err);
        return res.render('error', { error: err });
      }

      const fileData = {
        nome: req.file.originalname,
        descricao: req.body.descricao,
        path: newPath,
        mimetype: req.file.mimetype,
        data: new Date().toISOString(),
        cadeira: req.params._id
      };

      API.uploadFile(req.params._id, fileData, req.cookies.token)
        .then(dados => res.redirect(`/cadeiras/${req.params._id}`))
        .catch(erro => res.render('error', { error: erro }));
    });
  }
});

// POST /cadeiras/:_id/sumario/add (docentes)
router.post('/cadeiras/:_id/sumario/add', Auth.auth, function(req, res, next) {
  if (req.nivel === 'docente') {
    API.addSumario(req.params._id, req.body, req.cookies.token)
      .then(dados => res.redirect(`/cadeiras/${req.params._id}`))
      .catch(erro => res.render('error', {error: erro}))
  }
});

// POST /cadeiras/:_id/update
router.post('/cadeiras/:_id/update', Auth.auth, function(req, res, next) {
  req.body.horario_teoricas = req.body.horario_teoricas.split(',')
  req.body.horario_praticas = req.body.horario_praticas.split(',')
  req.body.avaliacao = req.body.avaliacao.split(',')
  API.updateCadeira(req.params._id, req.body, req.cookies.token)
    .then(dados => res.redirect(`/cadeiras/${req.params._id}`))
    .catch(erro => res.render('error', {error: erro}))
});

// POST /users/:_id/cadeiras/adicionar
router.post('/users/:_id/cadeiras/adicionar', Auth.auth, function(req, res, next) {
  if (req.nivel === 'aluno') {
    API.addCadeiraUser(req.params._id, req.body, req.cookies.token)
      .then(dados => res.redirect(`/cadeiras`))
      .catch(erro => res.render('error', {error: erro}))
  }
});

// GET /cadeiras/:_id/delete
router.get('/cadeiras/:_id/delete', Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin' || req.nivel === 'docente') {
    API.deleteCadeira(req.params._id, req.cookies.token)
      .then(dados => {
        res.redirect('/cadeiras')
      })
      .catch(erro => res.render('error', {error: erro}))
  }
});

// POST /perfil/:_id/delete
router.post('/perfil/:_id/delete', Auth.auth, function(req, res, next) {
  if (req.nivel === 'admin' || req.idUser === req.params._id) {
    API.deleteUser(req.params._id, req.body, req.cookies.token)
      .then(dados => {
        if (req.nivel !== 'admin') {
          res.clearCookie('token')
          res.redirect('/login')
        } else {
          res.redirect('/cadeiras')
        }
      })
      .catch(erro => res.render('error', {error: erro}))
  }
});

module.exports = router;

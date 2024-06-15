# <a id="auth">Servidor de Autenticação</a>

O Servidor de Autenticação é responsável pelo registo de novos utilizadores, login de um utilizador, alteração de passwords e eliminação de utilizadores. Este servidor funciona na porta 7778, mantendo-se assim separado dos outros servidores.

O Servidor de Autenticação é também responsável pela criação de um **token** (*jsonwebtoken*) sempre que um *login* é feito.  Esse *token* irá ficar guardado num *cookie* no *browser* do utilizador que será necessário para realizar qualquer pedido ao servidor.

No ficheiro `auth.js` temos a função que `verify` que trata sempre da verificação desse *token* de forma a ver se este ainda é válido.

## Registo

- `POST /register`: Cria uma nova conta de utilizador (não administrador)
- `POST /register/admin`: Cria uma nova conta de utilizador (administrador), requerendo menos dados

## Login

- `POST /login`: utilizador ganha acesso ao site se os seus campos de autenticação estiverem corretos e devolve um *token* de autenticação

## Alterar Password

Ao editar utilizador.
Password original para conseguir alterar a nova

- `POST /password`: este post é chamado caso ao utilizador um utilizador, se tente atualizar a password também. Requer a password original para conseguir alterar a nova. Depois de verificar o *token* do utilizador e se está autenticado, atualiza a password do utilizador.

## Apagar utilizador

Verifica se está autenticado

- `DELETE /:_id` : verifica o *token* e depois de acordo com o *id* do utilizador elimina os seus dados todos da base de dados.
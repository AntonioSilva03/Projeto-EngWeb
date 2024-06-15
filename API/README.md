# <a id="api">API</a>
A API da nossa aplicação foi implementada como um serviço isolado que possibilita a comunicação entre o servidor de interface e a base de dados. 

## Base de dados
A base de dados da nossa aplicação foi construída com o **MongoDB**.

A base de dados possui três coleções e modelos: **uc, user e ficheiro**.

A coleção `uc` serve para representar a estrutura de uma uc no MongoDB que contém informações como, o número, o título, o ano, os docentes, os estudantes, os horários, as avaliações, as datas importantes e os detalhes das aulas.

A coleção `user` serve para representar a estrutura de um user no MongoDB que contém informações como, o número, o nome, o email, o nível de acesso **(aluno, docente e administrador)**, o ano, a foto, a filiação, a categoria, a página de web, e as listas de cursos e cadeiras.

A coleção `ficheiro` serve para representar a estrutura de um ficheiro no MongoDB que contém informações como, o id, o nome, a descrição, o caminho, o tipo MIME, a data, e uma referência a uma cadeira.

## Rotas
A API disponibiliza as seguintes rotas para aceder aos dados das ucs, dos users e dos ficheiros.

- `GET /cadeiras`: retorna uma lista de todas as unidades curriculares da base de dados.
- `GET /cadeiras/:_id`: retorna uma unidade curricular, através do seu id.
- `GET /cadeiras/:_id/alunos`: retorna uma lista de alunos de uma unidade curricular, através do id da mesma.
- `GET /ficheiros`: retorna uma lista de todos os ficheiros da base de dados.
- `GET /cadeiras/:_id/ficheiros`: retorna uma lista de ficheiros de uma unidade curricular, através do id da mesma.
- `GET /cadeiras/:_id/ficheiros/:_idFicheiro/download`: retorna os dados de um ficheiro, através do seu id, para efetuar um download.
- `GET /users`: retorna uma lista de todos os users da base de dados.
- `GET /users/docentes`: retorna uma lista de todos os users identificados como sendo docentes.
- `GET /users/:_id`: retorna uma user, através do seu id.
- `GET users/:_id/cadeiras`: retorna uma lista de todas as cadeiras de um determinado user.
- `GET /users/:_id/cadeiras/adicionar`: retorna uma lista de ucs que um aluno pode escolher adicionar.
- `POST /cadeiras`: adiciona uma uc nova na nossa base de dados.
- `POST /cadeiras/:_id/update (docentes ou admin)`: atualiza os dados de uma uc da nossa base de dados, se o user for o regente da cadeira ou o administrador.
- `POST /cadeiras/:_id/sumarios (docentes)`: adiciona sumários a uma determinada uc, se o user for apenas um dos docentes da mesma.
- `POST /cadeiras/:_id/ficheiros`: adiciona ficheiros a uma determinada uc, se o user for um dos docentes da uc ou o administrador.
- `POST /users/:_id/cadeiras/adicionar`: permite que um determinado aluno, adicione ucs à sua lista de ucs existentes.
- `DELETE /cadeiras/:_id (docentes ou admin)`: remove uma uc com um determinado id, desde que a remoção seja feita pelo regente ou pelo administrador.
- `PUT /users/:_id`: atualiza os dados de um determinado user.
- `PUT /users/:_id/cadeiras/remove`: remove uma cadeira da lista de cadeiras de um determinado user.
- `PUT /cadeiras/:_id/alunos/:_idAluno/remove`: remove um determinado aluno de uma determinada cadeira.
- `DELETE /cadeiras/:_id/delete`: remove completamente uma uc com um determinado user.
- `DELETE /cadeiras/:_id/ficheiros/:_idFicheiro`: remove um determinado ficheiro de uma determinada uc.

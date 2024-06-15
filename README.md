<p align="center">
  <img src="https://github.com/Duarte0903/DSS_UMinho/blob/main/EEUMLOGO.png"/>
</p>

<h1 align="center">Engenharia Web - 2023/2024</h1>
<h2 align="center">Gerador de Sites de UC</h2>

## Grupo 5

| **Número** | **Nome** |
|:----------:|:--------:|
| A100550 | Duarte Machado Leitão |
| A100600 | Diogo Rafael dos Santos Barros |
| A100533 | António Filipe Castro Silva |
| A100646 | Diogo Ribeiro Vassalo de Abreu |

## Indice

- [Frontend](Frontend/README.md/#frontend)
- [API](API/README.md/#api)
- [Servidor de Autenticação](Auth/README.md/#auth)

## Introdução

Este relatório surge no âmbito da Unidade Curricular de Engenharia Web, em que nos foi proposto a concepção de uma aplicação Web.

A proposta de enunciado escolhida pelo grupo foi a criação de uma aplicação Web para a criação de sites para unidades curriculares. Nesta aplicação os docentes das UCs podem disponibilizar ficheiros, colocar informação sobre a UC (avaliação, horários, equipa docente) e fazer os sumários das aulas. Todos este conteúdo poderá ser consultado pelos alunos que ingressarem na UC.

## Objetivos

- Analisar o dataset de uma UC fornecido e tratá-lo de modo a criar um modelo em MongoDB para o guardar;

- Criar uma interface web de navegação em toda a informação disponibilizada, semelhante ao das UC que se listam no slide seguinte (há espaço para melhorar/alterar o design e até sugerir novas funcionalidades);

- Criar uma funcionalidade para a criação de novas UC (devem implementar todas as operações de CRUD sobre uma UC);

- Ter várias possibilidades de pesquisa sobre as UC criadas e ter uma interface centralizada para aceder ao site de cada uma;

- Permitir que o utilizador que criou a UC edite a informação desta;

## Utilizadores

- O sistema deverá estar protegido com autenticação;

- Deverão existir pelo menos 3 níveis de acesso:
    - **Administrador**: tem acesso a todas as operações;
    - **Produtor** (autor de recurso): pode consultar tudo e executar todas as operações sobre os recursos de que é produtor/autor;
    - **Consumidor**: pode consultar e descarregar os recursos públicos.

- Dados sobre o utilizador a guardar (sugestão):
nome, email, filiação (estudante, docente, curso, departamento, ...), nível (administrador, produtor ou consumidor), dataRegisto (registo na plataforma), dataUltimoAcesso, password, outros campos que julgue necessários...

## Tratamento de dados

Foram fornecidos 3 datasets, cada um com informação de uma UC específica. Cada UC continha uma lista com docentes e os seus metadados. Achamos relevante ler os 3 datasets e criar 2 datasets novos: um com informação relativa às **UCs** e outro com todos os **docentes** encontrados. Através da criação de ids para os docentes e para as UCs, cada UC passou a ter apenas o id dos seus docentes e cada docente tem uma lista com ids das UCs que leciona. Cada docente passou ainda a ter uma password que será usada no registo na plataforma. Para tal usou-se o script python (executar na diretoria data/):

```bash
python read_datasets.py
```

## Setup

1. Primeiro é necessário **instalar as dependências** do frontend, servidor de autenticação e da API. Na diretoria de cada um dos componetes usar o comando:

```bash
npm install
```

2. Para lançar o **container docker** é necessário usar o comando:

```bash
docker-compose up --build
```

3. Todos os docentes presentes no dataset obtido deverão ser registados na plataforma. Para tal criou-se um script que faz pedidos de **registo** ao servidor de autenticão (executar na diretoria data/):

```bash
python register_users.py
```

**Nota:** a password das contas importadas é "1234". Posteriormente o proprietário da conta poderá alterar a sua password.

O script anterior também trata do registo do admin fazendo um pedido de registo com o seguinte body:

```json
{
    "nome": "Administrador",
    "email": "admin@ucwebsites.com",
    "password": "admin"
}
```

4. A interface da aplicação pode ser acessada num browser através do link:

```
http://localhost:7777/login
```

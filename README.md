## Objetivos

- Analisar o dataset de uma UC fornecido e tratá-lo de modo a criar um modelo em MongoDB para o guardar;

- Criar uma interface web de navegação em toda a informação disponibilizada, semelhante ao das UC que se listam no slide seguinte (há espaço para melhorar/alterar o design e até sugerir novas funcionalidades);

- Criar uma funcionalidade para a criação de novas UC (devem implementar todas as operações de CRUD sobre uma UC);

- Ter várias possibilidades de pesquisa sobre as UC criadas e ter uma interface centralizada para aceder ao site de cada uma;

- Permitir que o utilizador que criou a UC edite a informação desta;

- E o que a imaginação ditar...

## Utilizadores

- O sistema deverá estar protegido com autenticação: username+password, chaveAPI, google, facebook, ...

- Deverão existir pelo menos 3 níveis de acesso:
    - Administrador - tem acesso a todas as operações;
    - Produtor (autor de recurso) - pode consultar tudo e executar todas as operações sobre os recursos de que é produtor/autor;
    - Consumidor - pode consultar e descarregar os recursos públicos.

- Dados sobre o utilizador a guardar (sugestão):
nome, email, filiação (estudante, docente, curso, departamento, ...), nível (administrador, produtor ou consumidor), dataRegisto (registo na plataforma), dataUltimoAcesso, password, outros campos que julgue necessários...

## Setup mongo

```
python launch_container.py ucWebsites users ./users.json ucs ./ucs.json ficheiros ./ficheiros.json
docker exec -it data-mongodb-1 mongosh
use ucWebsites
db.createCollection("ficheiros")
```

## Portas

- API -> 7779
- Auth -> 7778
- Frontend -> 7777
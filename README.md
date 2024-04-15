# shorten-url-api

### Sobre o Projeto
O projeto é uma API REST desenvolvida em Node.js com Express e TypeScript, utilizando TypeORM para interação com o banco de dados MySQL. A autenticação de usuários é feita com JWT (JSON Web Tokens), e as requisições são protegidas por middleware de autenticação.

A estrutura do projeto segue a arquitetura MVC (Model-View-Controller), com as rotas definidas nos controllers, a lógica de negócios nos services e a interação com o banco de dados nos repositories. O TypeORM é utilizado para definir as entidades e gerenciar as operações de banco de dados.

O projeto inclui funcionalidades como registro de usuários, autenticação com geração de token JWT, encurtamento de URLs e controle de acesso às URLs encurtadas. O código está organizado em pequenos componentes , seguindo boas práticas de desenvolvimento.

Os testes da API são feitos com o Insomnia, e o projeto é containerizado com Docker para facilitar a implantação e o gerenciamento do ambiente de desenvolvimento. As dependências do projeto são gerenciadas pelo npm, com scripts definidos no package.json para facilitar o desenvolvimento e a execução do mesmo.

## Node Version
`20.12.2`

## Como Começar

Para começar com o projeto, siga estes passos:

1. Clone o repositório: `https://github.com/bacildo/teddy-open-finance-api.git`
2. Instale as dependências:`npm install`
3. Inicie o compose `docker-compose up`

### Endpoints da API
## Login de Usuário
Método: POST
URL: http://localhost:3000/auth/login
Body:
json
{
  "email": "bacilddo@e.com",
  "password": "12345"
}
Autenticação: Sem Bearer Token

## Edição de Usuário
Método: PUT
URL: http://localhost:3000/user/1
Body:
json
{
  "email": "bacilddo@e.com",
  "password": "12345"
}
Autenticação: Com Bearer Token

## Registro de Usuário
Método: POST
URL: http://localhost:3000/user/register
Body:
json
{
  "email": "bacilddo@e.com",
  "password": "12345"
}
Autenticação: Sem Bearer Token

## Encurtamento de URL sem Usuário Logado
Método: POST
URL: http://localhost:3000/shortenedURL
Body:
json
{
  "url": "https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/"
}
Autenticação: Sem Bearer Token

## Encurtamento de URL com Usuário Logado
Método: POST
URL: http://localhost:3000/shortenedURL
Body:
json
{
  "url": "https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/"
}
Autenticação: Com Bearer Token

## Atualização de URL Original
Método: PUT
URL: http://localhost:3000/shortenedURL/2
Body:
json
{
  "url": "http://google.com"
}
Autenticação: Com Bearer Token

## Listagem de URLs Curtas e Contagem de Cliques
Método: GET
URL: http://localhost:3000/shortenedURL/list
Autenticação: Com Bearer Token

## Deleção de Informações da URL Curta
Método: DELETE
URL: http://localhost:3000/shortenedURL/1
Autenticação: Com Bearer Token

## Acesso a URL Curta e Redirecionamento para Original
Método: GET
URL: http://localhost:3000/shortenedURL?shortUrl=http://localhost/UtGpyN
Autenticação: Com Bearer Token   

Obs: nessa situação, passar na query param a url curta gerada pela api, a que está presente é apenas um exemplo.

 

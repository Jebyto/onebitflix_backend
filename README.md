# OneBitFlix Backend

Backend do **OneBitFlix**, uma plataforma estilo Netflix para cursos. Este projeto fornece a API consumida pelo projeto [`onebitflix_frontend`](https://github.com/Jebyto/onebitflix_frontend), e inclui um painel administrativo com AdminJS para gerenciar categorias, cursos, aulas e usuários.

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- Sequelize e Sequelize CLI
- AdminJS
- JWT para autenticação
- bcrypt para hash de senhas
- CORS

## O Que Este Projeto Faz

- Cadastro e login de usuários.
- Autenticação por token JWT.
- Listagem de categorias e cursos.
- Busca, cursos em destaque, cursos mais novos e cursos populares.
- Detalhe de curso com aulas, favoritos e likes do usuário autenticado.
- Controle de favoritos e likes.
- Registro de progresso assistido por aula.
- Streaming de vídeos MP4 com suporte a range requests.
- Painel AdminJS em `/admin` para gerenciar o catálogo e usuários.
- Upload local de thumbnails de cursos e vídeos de episódios pelo AdminJS.

## Requisitos

- Node.js instalado.
- npm instalado.
- PostgreSQL rodando localmente ou em outro host acessível.
- Um banco de dados PostgreSQL criado para o projeto.

## Como Rodar Localmente

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure o Sequelize CLI

Copie o arquivo de exemplo:

```bash
cp config/sequelizeCli.js.example config/sequelizeCli.js
```

Edite `config/sequelizeCli.js` com os dados do seu PostgreSQL:

```js
module.exports = {
  development: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'seu_usuario',
    password: 'sua_senha',
    database: 'onebitflix_development'
  }
}
```

Esse arquivo é usado pelo Sequelize CLI para rodar migrations e seeders.

### 3. Configure a conexão usada pela aplicação

O servidor usa a conexão definida em `src/database/index.ts`. Ajuste os mesmos dados do banco nesse arquivo:

```ts
export const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  username: "seu_usuario",
  password: "sua_senha",
  database: "onebitflix_development",
  define: {
    underscored: true,
  }
});
```

Atualmente o projeto não usa `.env`, então essas configurações precisam ser ajustadas diretamente nos arquivos locais.

### 4. Crie as pastas de upload

Os vídeos são salvos em `uploads/` e as thumbnails em `public/thumbnails/`.

```bash
mkdir -p uploads public/thumbnails
```

### 5. Rode as migrations

```bash
npx sequelize-cli db:migrate
```

### 6. Rode os seeders

```bash
npx sequelize-cli db:seed:all
```

Os seeders criam categorias, cursos iniciais e um usuário administrador.

### 7. Inicie o servidor

```bash
npm run dev
```

Por padrão, a API sobe em:

```txt
http://localhost:3000
```

Você também pode definir outra porta com a variável `PORT`:

```bash
PORT=3333 npm run dev
```

## AdminJS

O painel administrativo fica em:

```txt
http://localhost:3000/admin
```

Após rodar os seeders, use:

```txt
E-mail: admin@email.com
Senha: 123456
```

Pelo painel é possível gerenciar:

- Categorias
- Cursos
- Episódios
- Usuários

O upload de thumbnails de cursos salva arquivos em `public/thumbnails/...`. O upload de vídeos dos episódios salva arquivos em `uploads/videos/...`.

## Autenticação

A maioria das rotas exige token JWT no header:

```http
Authorization: Bearer SEU_TOKEN
```

O token é retornado no login:

```http
POST /auth/login
```

A rota de streaming usa o token pela query string:

```txt
/episodes/stream?videoUrl=videos/course-1/aula.mp4&token=SEU_TOKEN
```

## Rotas Da API

### Autenticação

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| POST | `/auth/register` | Não | Cria uma conta de usuário |
| POST | `/auth/login` | Não | Faz login e retorna o token JWT |

Exemplo de cadastro:

```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@email.com",
  "password": "123456",
  "birth": "1990-01-01",
  "phone": "85999999999"
}
```

### Categorias

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| GET | `/categories` | Sim | Lista categorias paginadas |
| GET | `/categories/:id` | Sim | Busca uma categoria com seus cursos |

Paginação:

```txt
/categories?page=1&perPage=10
```

### Cursos

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| GET | `/courses/featured` | Sim | Lista até 3 cursos em destaque de forma aleatória |
| GET | `/courses/newest` | Não | Lista os 10 cursos mais novos |
| GET | `/courses/search?name=javascript` | Sim | Busca cursos por nome |
| GET | `/courses/popular` | Sim | Lista até 10 cursos ordenados por likes |
| GET | `/courses/:id` | Sim | Detalha um curso com episódios, liked e favorited |

A busca também aceita paginação:

```txt
/courses/search?name=node&page=1&perPage=10
```

### Episódios

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| GET | `/episodes/stream` | Sim, via query `token` | Faz stream de um vídeo |
| GET | `/episodes/:id/watchTime` | Sim | Retorna o progresso assistido da aula |
| POST | `/episodes/:id/watchTime` | Sim | Salva ou atualiza o progresso assistido |

Exemplo para salvar progresso:

```json
{
  "seconds": 240
}
```

### Favoritos

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| POST | `/favorites` | Sim | Adiciona um curso aos favoritos |
| GET | `/favorites` | Sim | Lista favoritos do usuário atual |
| DELETE | `/favorites/:id` | Sim | Remove um curso dos favoritos |

Exemplo:

```json
{
  "courseId": 1
}
```

### Likes

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| POST | `/likes` | Sim | Dá like em um curso |
| DELETE | `/likes/:id` | Sim | Remove o like de um curso |

Exemplo:

```json
{
  "courseId": 1
}
```

### Usuário Atual

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| GET | `/users/current` | Sim | Retorna os dados do usuário autenticado |
| PUT | `/users/current` | Sim | Atualiza dados cadastrais |
| PUT | `/users/current/password` | Sim | Atualiza a senha |
| GET | `/users/current/watching` | Sim | Lista cursos/aulas em andamento |

Exemplo para atualizar senha:

```json
{
  "currentPassword": "123456",
  "newPassword": "novaSenha"
}
```

## Estrutura Principal

```txt
src/
  adminjs/          Configuração do painel administrativo
  controllers/      Camada HTTP das rotas
  database/         Migrations e seeders
  helpers/          Funções utilitárias
  middlewares/      Middlewares, como autenticação JWT
  models/           Models e associações Sequelize
  services/         Regras de negócio e acesso aos models
  routes.ts         Definição das rotas da API
  server.ts         Configuração do Express e inicialização do servidor
```

## Banco De Dados

As principais tabelas criadas pelas migrations são:

- `categories`
- `courses`
- `episodes`
- `users`
- `favorites`
- `likes`
- `watch_times`

Relacionamentos principais:

- Uma categoria possui muitos cursos.
- Um curso possui muitos episódios.
- Usuários podem favoritar cursos.
- Usuários podem dar like em cursos.
- Usuários possuem progresso por episódio em `watch_times`.

## Integração Com O Frontend

Este backend foi feito para ser usado com o projeto `onebitflix_frontend`, que fica na pasta anterior de projetos GitHub. Mantenha este servidor rodando, normalmente em `http://localhost:3000`, antes de iniciar o frontend.

Se o frontend estiver configurado para outra URL de API, ajuste a configuração do frontend ou rode este backend na porta esperada.

## Observações Importantes

- O projeto ainda usa segredo JWT fixo em `src/services/jwtService.ts`.
- O AdminJS usa `cookiePassword` fixo em `src/adminjs/authentication.ts`.
- Para produção, mova credenciais de banco, segredo JWT e senha de cookie para variáveis de ambiente.
- O banco usado pela aplicação (`src/database/index.ts`) e o banco usado pelo CLI (`config/sequelizeCli.js`) precisam apontar para o mesmo lugar.
- Os seeders não criam episódios com vídeos. Cadastre episódios pelo AdminJS e faça upload dos arquivos MP4.

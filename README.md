# Backend

Este é o backend implementado em Node.js, que gerencia operações CRUD para fornecedores e contas a pagar, com autenticação JWT.

## Tecnologias Utilizadas

*   **Node.js**
*   **Express.js**: Framework web para Node.js.
*   **PostgreSQL**: Banco de dados relacional.
*   **`pg`**: Driver Node.js para PostgreSQL.
*   **`jsonwebtoken`**: Para autenticação baseada em JWT.
*   **`bcrypt`**: Para hash de senhas.
*   **`cors`**: Middleware para habilitar CORS.
*   **`dotenv`**: Para carregar variáveis de ambiente.
*   **`nodemon`**: Para desenvolvimento, reinicia o servidor automaticamente.

## Configuração e Execução

### Pré-requisitos

*   Docker e Docker Compose instalados.
*   Node.js e npm instalados.

### 1. Iniciar o Banco de Dados

Certifique-se de que o Docker esteja em execução. Navegue até a pasta `backend` e execute:

```bash
sudo docker-compose up -d
```

Se a porta `5432` estiver em uso, você precisará parar o serviço que a está utilizando ou alterar a porta no `docker-compose.yml`.

### 2. Instalar Dependências

Na pasta `backend`, instale as dependências do Node.js:

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis (os valores padrão são baseados no `docker-compose.yml` e na configuração do projeto):

```
PORT=3000
DB_USER=postgres
DB_PASSWORD=postdba
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=financeiro_db
JWT_SECRET=supersecretjwtkey
```

### 4. Iniciar o Backend

Na pasta `backend`, inicie o servidor:

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000` (ou na porta configurada em `PORT`).

## Tabelas do Banco de Dados

As tabelas são definidas no arquivo `init.sql`:

### `Fornecedor`

*   `ID` (SERIAL PRIMARY KEY): Identificador único do fornecedor.
*   `Removido` (BOOLEAN DEFAULT false): Indica se o registro foi logicamente removido.
*   `NomeFantasia` (VARCHAR(100)): Nome fantasia do fornecedor.
*   `RazaoSocial` (VARCHAR(200)): Razão social do fornecedor.
*   `CNPJ` (VARCHAR(18)): CNPJ do fornecedor.

### `ContaPagar`

*   `ID` (SERIAL PRIMARY KEY): Identificador único da conta a pagar.
*   `Removido` (BOOLEAN DEFAULT false): Indica se o registro foi logicamente removido.
*   `Descricao` (VARCHAR(255)): Descrição da conta.
*   `DataVencimento` (DATE): Data de vencimento da conta.
*   `Valor` (DECIMAL(10, 2)): Valor original da conta.
*   `DataPagamento` (DATE): Data em que a conta foi paga (opcional).
*   `ValorPago` (DECIMAL(10, 2)): Valor pago (opcional).
*   `FornecedorID` (INTEGER): Chave estrangeira para a tabela `Fornecedor`.

### `Usuario`

*   `ID` (SERIAL PRIMARY KEY): Identificador único do usuário.
*   `Removido` (BOOLEAN DEFAULT false): Indica se o registro foi logicamente removido.
*   `Login` (VARCHAR(50) UNIQUE): Nome de usuário para login.
*   `Senha` (VARCHAR(255)): Senha do usuário (hash).

## Endpoints da API

Todos os endpoints de CRUD (exceto `/api/auth/login` e `/api/auth/register`) exigem um token JWT válido no cabeçalho `Authorization: Bearer <token>`.

### Autenticação (`/api/auth`)

*   `POST /api/auth/register`: Registra um novo usuário. Corpo: `{ "login": "string", "senha": "string" }`
*   `POST /api/auth/login`: Autentica um usuário e retorna um token JWT. Corpo: `{ "login": "string", "senha": "string" }`

### Fornecedores (`/api/fornecedores`)

*   `GET /api/fornecedores`: Retorna todos os fornecedores não removidos.
*   `GET /api/fornecedores/:id`: Retorna um fornecedor específico pelo ID.
*   `POST /api/fornecedores`: Cria um novo fornecedor. Corpo: `{ "nomefantasia": "string", "razaosocial": "string", "cnpj": "string" }`
*   `PUT /api/fornecedores/:id`: Atualiza um fornecedor existente pelo ID. Corpo: `{ "nomefantasia": "string", "razaosocial": "string", "cnpj": "string" }`
*   `DELETE /api/fornecedores/:id`: Realiza um soft delete em um fornecedor pelo ID.

### Contas a Pagar (`/api/contas`)

*   `GET /api/contas`: Retorna todas as contas a pagar não removidas.
*   `GET /api/contas/:id`: Retorna uma conta a pagar específica pelo ID.
*   `POST /api/contas`: Cria uma nova conta a pagar. Corpo: `{ "descricao": "string", "datavencimento": "YYYY-MM-DD", "valor": "number", "datapagamento": "YYYY-MM-DD" (opcional), "valorpago": "number" (opcional), "fornecedorid": "integer" }`
*   `PUT /api/contas/:id`: Atualiza uma conta a pagar existente pelo ID. Corpo: `{ "descricao": "string", "datavencimento": "YYYY-MM-DD", "valor": "number", "datapagamento": "YYYY-MM-DD" (opcional), "valorpago": "number" (opcional), "fornecedorid": "integer" }`
*   `DELETE /api/contas/:id`: Realiza um soft delete em uma conta a pagar pelo ID.

## Exemplos de Requisições cURL

Primeiro, registre e faça login para obter um token JWT. Substitua `localhost:3000` pela URL do seu backend, se diferente.

```bash
# 1. Registrar um novo usuário
curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"login": "testuser", "senha": "testpassword"}'

# 2. Fazer login e obter o token JWT
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
             -H "Content-Type: application/json" \
             -d '{"login": "testuser", "senha": "testpassword"}' | jq -r '.token')

echo "Seu token JWT: $TOKEN"

# --- Fornecedores ---

# 3. Criar um novo fornecedor
curl -X POST http://localhost:3000/api/fornecedores \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"nomefantasia": "Fornecedor Teste", "razaosocial": "Fornecedor Teste LTDA", "cnpj": "11.222.333/0001-44"}'

# 4. Obter todos os fornecedores
curl -X GET http://localhost:3000/api/fornecedores \
     -H "Authorization: Bearer $TOKEN"

# 5. Obter um fornecedor por ID (substitua 1 pelo ID real)
curl -X GET http://localhost:3000/api/fornecedores/1 \
     -H "Authorization: Bearer $TOKEN"

# 6. Atualizar um fornecedor por ID (substitua 1 pelo ID real)
curl -X PUT http://localhost:3000/api/fornecedores/1 \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"nomefantasia": "Fornecedor Atualizado", "razaosocial": "Fornecedor Atualizado S.A.", "cnpj": "11.222.333/0001-44"}'

# 7. Deletar (soft delete) um fornecedor por ID (substitua 1 pelo ID real)
curl -X DELETE http://localhost:3000/api/fornecedores/1 \
     -H "Authorization: Bearer $TOKEN"

# --- Contas a Pagar ---

# 8. Criar uma nova conta a pagar (substitua fornecedorid pelo ID real de um fornecedor)
curl -X POST http://localhost:3000/api/contas \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"descricao": "Aluguel", "datavencimento": "2025-12-01", "valor": 1500.00, "fornecedorid": 1}'

# 9. Obter todas as contas a pagar
curl -X GET http://localhost:3000/api/contas \
     -H "Authorization: Bearer $TOKEN"

# 10. Obter uma conta a pagar por ID (substitua 1 pelo ID real)
curl -X GET http://localhost:3000/api/contas/1 \
      -H "Authorization: Bearer $TOKEN"

# 11. Atualizar uma conta a pagar por ID (substitua 1 pelo ID real)
curl -X PUT http://localhost:3000/api/contas/1 \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"descricao": "Aluguel Atualizado", "datavencimento": "2025-12-05", "valor": 1600.00, "fornecedorid": 1}'

# 12. Deletar (soft delete) uma conta a pagar por ID (substitua 1 pelo ID real)
curl -X DELETE http://localhost:3000/api/contas/1 \
      -H "Authorization: Bearer $TOKEN"
```

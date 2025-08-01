# Todo List API

API REST completa para gerenciamento de tarefas com autenticação JWT e organização por projetos.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web rápido
- **TypeScript** - Linguagem tipada
- **PostgreSQL** - Banco de dados
- **Prisma ORM** - ORM para banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Zod** - Validação de dados
- **Vitest** - Framework de testes

## 📋 Funcionalidades

### 🔐 Autenticação
- ✅ Cadastro de usuário (`POST /auth/register`)
- ✅ Login com JWT (`POST /auth/login`)

### 🗂 Projetos
- ✅ Criar projeto (`POST /projects`)
- ✅ Listar projetos (`GET /projects`)
- ✅ Excluir projeto (`DELETE /projects/:id`)
- ✅ Listar tarefas de um projeto (`GET /projects/:projectId/todos`)

### 📌 Tarefas
- ✅ Criar tarefa (`POST /todos`)
- ✅ Listar tarefas (`GET /todos`)
- ✅ Buscar tarefa por ID (`GET /todos/:id`) ✨
- ✅ Marcar como concluída (`PATCH /todos/:id/complete`)
- ✅ Excluir tarefa (`DELETE /todos/:id`)

### 🧩 Subtarefas
- ✅ Criar subtarefa (`POST /todos/:todoId/subtasks`)
- ✅ Listar subtarefas (`GET /todos/:todoId/subtasks`)
- ✅ Marcar como concluída (`PATCH /subtasks/:id/complete`)
- ✅ Excluir subtarefa (`DELETE /subtasks/:id`)

## 🛠 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/Jacksons357/todolist-backend.git
cd todolist-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/todolist_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Server
PORT=3333
HOST="0.0.0.0"
```

4. **Configure o banco de dados**
```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate
```

5. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 Documentação da API

Acesse a documentação Swagger em: `http://localhost:3333/docs`

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot reload
- `npm run build` - Compila o projeto TypeScript
- `npm start` - Inicia o servidor em produção
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:migrate` - Executa as migrações do banco
- `npm run db:studio` - Abre o Prisma Studio
- `npm run test` - Executa testes em modo watch
- `npm run test:run` - Executa todos os testes
- `npm run test:coverage` - Executa testes com cobertura

## 🗂 Estrutura do Projeto

```
src/
├── controllers/     # Controladores das rotas
├── routes/         # Definição das rotas
├── schemas/        # Schemas de validação (Zod)
├── services/       # Lógica de negócio
├── plugins/        # Plugins do Fastify
├── lib/           # Configurações (Prisma)
├── types/         # Tipos TypeScript
├── test/          # Testes unitários
│   ├── services/  # Testes dos serviços
│   └── controllers/ # Testes dos controladores
└── index.ts       # Arquivo principal
```

## 🔐 Autenticação

Todas as rotas (exceto `/auth/*`) requerem autenticação via JWT.

**Header necessário:**
```
Authorization: Bearer <token>
```

## 🧪 Testes

O projeto inclui testes unitários abrangentes usando Vitest:

### Executar Testes
```bash
# Executar todos os testes
npm run test:run

# Executar testes em modo watch
npm run test

# Executar testes com cobertura
npm run test:coverage
```

### Cobertura de Testes
- **AuthService**: Testes de registro e login
- **AuthController**: Testes de endpoints de autenticação
- **TodoService**: Testes de CRUD de tarefas, incluindo a nova funcionalidade de buscar por ID

### 🔧 Correções Implementadas

#### Problema do JWT Token
- **Problema**: O método `reply.jwtSign()` retornava `[object Promise]` em vez do token JWT
- **Solução**: Adicionado `await` antes de `reply.jwtSign()` no controller de autenticação
- **Teste**: Criados testes unitários que verificam a geração correta do token

#### Nova Funcionalidade: Buscar Tarefa por ID
- **Rota**: `GET /todos/:id` para buscar tarefa específica
- **Funcionalidade**: Retorna tarefa completa com projeto e subtarefas
- **Testes**: Cobertura completa da nova funcionalidade

### Exemplo de Uso da Nova Rota

Para buscar uma tarefa específica por ID (equivalente a `/dashboard/todos/${todo.id}`):

```http
GET /todos/{todoId}
Authorization: Bearer {jwt_token}
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "todo-id-123",
    "title": "Tarefa de teste",
    "description": "Descrição da tarefa",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "note": "Nota adicional",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "project": {
      "id": "project-id-123",
      "name": "Nome do Projeto"
    },
    "subtasks": [
      {
        "id": "subtask-id-1",
        "title": "Subtarefa 1",
        "description": "Descrição da subtarefa",
        "completed": false,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## 📝 Exemplos de Uso

### 1. Cadastrar usuário
```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456"
  }'
```

### 2. Fazer login
```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'
```

### 3. Criar projeto
```bash
curl -X POST http://localhost:3333/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Projeto Trabalho",
    "description": "Tarefas relacionadas ao trabalho"
  }'
```

### 4. Criar tarefa
```bash
curl -X POST http://localhost:3333/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Implementar API",
    "description": "Criar endpoints da API",
    "projectId": "project-id-here"
  }'
```

### 5. Criar subtarefa
```bash
curl -X POST http://localhost:3333/todos/todo-id-here/subtasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Criar endpoint de autenticação",
    "description": "Implementar login e registro"
  }'
```

## 🛡️ Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação JWT
- ✅ Validação de dados com Zod
- ✅ Isolamento de dados por usuário
- ✅ CORS configurado

## 📊 Banco de Dados

O projeto usa PostgreSQL com Prisma ORM. As principais entidades são:

- **User** - Usuários do sistema
- **Project** - Projetos dos usuários
- **Todo** - Tarefas (podem estar associadas a projetos)
- **Subtask** - Subtarefas de uma tarefa

## 🚀 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente
2. Execute `npm run build`
3. Execute `npm run db:migrate`
4. Inicie com `npm start`

## 📄 Licença

MIT 
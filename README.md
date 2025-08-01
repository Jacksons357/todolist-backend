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
└── index.ts       # Arquivo principal
```

## 🔐 Autenticação

Todas as rotas (exceto `/auth/*`) requerem autenticação via JWT.

**Header necessário:**
```
Authorization: Bearer <token>
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
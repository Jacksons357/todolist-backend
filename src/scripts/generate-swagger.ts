import { config } from 'dotenv'
import Fastify from 'fastify'
import cors from '@fastify/cors'

// Load environment variables
config()

// Import plugins
import authPlugin from '../plugins/auth'
import swaggerPlugin from '../plugins/swagger'

// Import routes
import { authRoutes } from '../routes/auth.routes'
import { projectRoutes } from '../routes/project.routes'
import { todoRoutes } from '../routes/todo.routes'
import { subtaskRoutes } from '../routes/subtask.routes'

async function generateSwagger() {
  const fastify = Fastify({
    logger: false
  })

  // Register plugins
  fastify.register(cors, {
    origin: true,
    credentials: true
  })

  fastify.register(authPlugin)
  fastify.register(swaggerPlugin)

  // Register routes
  fastify.register(authRoutes, { prefix: '/auth' })
  fastify.register(projectRoutes, { prefix: '/projects' })
  fastify.register(todoRoutes, { prefix: '/todos' })
  fastify.register(subtaskRoutes, { prefix: '/' })

  try {
    await fastify.ready()
    
    const swaggerObject = fastify.swagger()
    
    console.log('📚 Swagger documentation generated successfully!')
    console.log('📖 Access the documentation at: http://localhost:3333/docs')
    console.log('\n🔗 Available endpoints:')
    console.log('• POST /auth/register - Cadastrar usuário')
    console.log('• POST /auth/login - Fazer login')
    console.log('• POST /projects - Criar projeto')
    console.log('• GET /projects - Listar projetos')
    console.log('• DELETE /projects/:id - Excluir projeto')
    console.log('• GET /projects/:projectId/todos - Listar tarefas do projeto')
    console.log('• POST /todos - Criar tarefa')
    console.log('• GET /todos - Listar tarefas')
    console.log('• PATCH /todos/:id/complete - Marcar tarefa como concluída')
    console.log('• DELETE /todos/:id - Excluir tarefa')
    console.log('• POST /todos/:todoId/subtasks - Criar subtarefa')
    console.log('• GET /todos/:todoId/subtasks - Listar subtarefas')
    console.log('• PATCH /subtasks/:id/complete - Marcar subtarefa como concluída')
    console.log('• DELETE /subtasks/:id - Excluir subtarefa')
    
    await fastify.close()
  } catch (error) {
    console.error('❌ Error generating Swagger documentation:', error)
    process.exit(1)
  }
}

generateSwagger() 
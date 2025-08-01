import Fastify from 'fastify'
import cors from '@fastify/cors'
import { config } from 'dotenv'

// Load environment variables
config()

// Import plugins
import authPlugin from './plugins/auth'
import swaggerPlugin from './plugins/swagger'

// Import routes
import { authRoutes } from './routes/auth.routes'
import { projectRoutes } from './routes/project.routes'
import { todoRoutes } from './routes/todo.routes'
import { subtaskRoutes } from './routes/subtask.routes'

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
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

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() }
})

// Root endpoint
fastify.get('/', async (request, reply) => {
  return {
    message: 'Todo List API',
    version: '1.0.0',
    documentation: '/docs',
    health: '/health'
  }
})

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error)
  
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: 'Dados inválidos',
      details: error.validation
    })
  }

  return reply.status(500).send({
    success: false,
    error: 'Erro interno do servidor'
  })
})

// Start server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3333
    const host = process.env.HOST || '0.0.0.0'

    await fastify.listen({ port, host })
    
    console.log(`🚀 Server running on http://${host}:${port}`)
    console.log(`📚 Documentation available at http://${host}:${port}/docs`)
    console.log(`💚 Health check at http://${host}:${port}/health`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start() 
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Todo List API',
        description: 'API REST para Todo List com autenticação JWT e organização por projetos',
        version: '1.0.0'
      },
      host: 'localhost:3333',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'JWT token no formato: Bearer <token>'
        }
      },
      security: [
        {
          Bearer: []
        }
      ]
    }
  })

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request: any, reply: any, next: any) {
        next()
      },
      preHandler: function (request: any, reply: any, next: any) {
        next()
      }
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header
  })
}) 
import { FastifyInstance } from 'fastify'
import { AuthController } from '../controllers/auth.controller'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', {
    schema: {
      tags: ['Autenticação'],
      summary: 'Cadastrar novo usuário',
      description: 'Cria uma nova conta de usuário',
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            description: 'Nome completo do usuário'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'Senha do usuário (mínimo 6 caracteres)'
          }
        }
      },
      response: {
        201: {
          description: 'Usuário criado com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' }
              }
            },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Dados inválidos',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        },
        409: {
          description: 'Usuário já existe',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, AuthController.register)

  fastify.post('/login', {
    schema: {
      tags: ['Autenticação'],
      summary: 'Fazer login',
      description: 'Autentica o usuário e retorna um token JWT',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário'
          },
          password: {
            type: 'string',
            description: 'Senha do usuário'
          }
        }
      },
      response: {
        200: {
          description: 'Login realizado com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' }
                  }
                },
                token: { type: 'string' }
              }
            },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Dados inválidos',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        },
        401: {
          description: 'Credenciais inválidas',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, AuthController.login)
} 
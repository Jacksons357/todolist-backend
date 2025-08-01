import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthService } from '../services/auth.service'
import { createUserSchema, loginSchema } from '../schemas'

export class AuthController {
  static async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userData = createUserSchema.parse(request.body)

      const user = await AuthService.register(userData)

      reply.status(201).send({
        success: true,
        data: user,
        message: 'Usuário criado com sucesso'
      })
    } catch (error: any) {
      if (error.message === 'Usuário já existe com este email') {
        reply.status(409).send({
          success: false,
          error: error.message
        })
        return
      }

      reply.status(400).send({
        success: false,
        error: error.message || 'Erro ao criar usuário'
      })
    }
  }

  static async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const loginData = loginSchema.parse(request.body)

      const user = await AuthService.login(loginData)

      // Generate JWT token
      const token = reply.jwtSign({
        id: user.id,
        email: user.email,
        name: user.name
      })

      reply.status(200).send({
        success: true,
        data: {
          user,
          token
        },
        message: 'Login realizado com sucesso'
      })
    } catch (error: any) {
      if (error.message === 'Email ou senha inválidos') {
        reply.status(401).send({
          success: false,
          error: error.message
        })
        return
      }

      reply.status(400).send({
        success: false,
        error: error.message || 'Erro ao fazer login'
      })
    }
  }
} 
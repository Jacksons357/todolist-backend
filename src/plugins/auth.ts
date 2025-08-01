import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      email: string
      name: string
    }
    jwtVerify(): Promise<any>
  }
  
  interface FastifyReply {
    jwtSign(payload: any): string
  }
  
  interface FastifyInstance {
    jwt: {
      verify(token: string): any
    }
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    swagger(): any
  }
}

export default fp(async function (fastify: FastifyInstance) {
  // Register JWT plugin
  await fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here'
  })

  // Authentication decorator
  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send({
        success: false,
        error: 'Token inválido ou expirado'
      })
    }
  })

  // Add user to request
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (request.headers.authorization) {
        const token = request.headers.authorization.replace('Bearer ', '')
        const decoded = fastify.jwt.verify(token)
        request.user = decoded as any
      }
    } catch (err) {
      // Token is optional for some routes
    }
  })
}) 
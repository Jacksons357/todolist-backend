import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthController } from '../../controllers/auth.controller'
import { AuthService } from '../../services/auth.service'
import { createUserSchema, loginSchema } from '../../schemas'

// Mock AuthService
vi.mock('../../services/auth.service')
vi.mock('../../schemas', () => ({
  createUserSchema: {
    parse: vi.fn()
  },
  loginSchema: {
    parse: vi.fn()
  }
}))

describe('AuthController', () => {
  let mockRequest: Partial<FastifyRequest>
  let mockReply: Partial<FastifyReply>

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockRequest = {
      body: {}
    }

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      jwtSign: vi.fn().mockResolvedValue('mock-jwt-token')
    }
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      const mockUser = {
        id: 'user-id-123',
        name: userData.name,
        email: userData.email,
        createdAt: new Date()
      }

      // Mock schema validation
      vi.mocked(createUserSchema.parse).mockReturnValue(userData)

      // Mock AuthService.register
      vi.mocked(AuthService.register).mockResolvedValue(mockUser as any)

      await AuthController.register(mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(createUserSchema.parse).toHaveBeenCalledWith(mockRequest.body)
      expect(AuthService.register).toHaveBeenCalledWith(userData)
      expect(mockReply.status).toHaveBeenCalledWith(201)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
        message: 'Usuário criado com sucesso'
      })
    })

    it('should handle user already exists error', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      // Mock schema validation
      vi.mocked(createUserSchema.parse).mockReturnValue(userData)

      // Mock AuthService.register to throw error
      vi.mocked(AuthService.register).mockRejectedValue(new Error('Usuário já existe com este email'))

      await AuthController.register(mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).toHaveBeenCalledWith(409)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: 'Usuário já existe com este email'
      })
    })

    it('should handle generic error', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      // Mock schema validation
      vi.mocked(createUserSchema.parse).mockReturnValue(userData)

      // Mock AuthService.register to throw generic error
      vi.mocked(AuthService.register).mockRejectedValue(new Error('Database error'))

      await AuthController.register(mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).toHaveBeenCalledWith(400)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: 'Database error'
      })
    })
  })

  describe('login', () => {
    it('should login successfully and return JWT token', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const mockUser = {
        id: 'user-id-123',
        name: 'Test User',
        email: loginData.email
      }

      // Mock schema validation
      vi.mocked(loginSchema.parse).mockReturnValue(loginData)

      // Mock AuthService.login
      vi.mocked(AuthService.login).mockResolvedValue(mockUser as any)

      await AuthController.login(mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(loginSchema.parse).toHaveBeenCalledWith(mockRequest.body)
      expect(AuthService.login).toHaveBeenCalledWith(loginData)
      expect(mockReply.jwtSign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name
      })
      expect(mockReply.status).toHaveBeenCalledWith(200)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: {
          user: mockUser,
          token: 'mock-jwt-token'
        },
        message: 'Login realizado com sucesso'
      })
    })

    it('should handle invalid credentials error', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      // Mock schema validation
      vi.mocked(loginSchema.parse).mockReturnValue(loginData)

      // Mock AuthService.login to throw error
      vi.mocked(AuthService.login).mockRejectedValue(new Error('Email ou senha inválidos'))

      await AuthController.login(mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).toHaveBeenCalledWith(401)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: 'Email ou senha inválidos'
      })
    })

    it('should handle generic error', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }

      // Mock schema validation
      vi.mocked(loginSchema.parse).mockReturnValue(loginData)

      // Mock AuthService.login to throw generic error
      vi.mocked(AuthService.login).mockRejectedValue(new Error('Database error'))

      await AuthController.login(mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).toHaveBeenCalledWith(400)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: 'Database error'
      })
    })
  })
}) 
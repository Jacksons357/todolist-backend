import { describe, it, expect, beforeEach, vi } from 'vitest'
import bcrypt from 'bcryptjs'
import { AuthService } from '../../services/auth.service'
import { prisma } from '../../lib/prisma'

// Mock bcrypt
vi.mock('bcryptjs')

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      const hashedPassword = 'hashedPassword123'
      const mockUser = {
        id: 'user-id-123',
        name: userData.name,
        email: userData.email,
        createdAt: new Date()
      }

      // Mock bcrypt.hash
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never)

      // Mock prisma.user.findUnique (user doesn't exist)
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      // Mock prisma.user.create
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser as any)

      const result = await AuthService.register(userData)

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email }
      })
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      })
      expect(result).toEqual(mockUser)
    })

    it('should throw error if user already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      const existingUser = {
        id: 'existing-user-id',
        name: 'Existing User',
        email: 'test@example.com',
        password: 'hashedPassword'
      }

      // Mock prisma.user.findUnique (user exists)
      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any)

      await expect(AuthService.register(userData)).rejects.toThrow('Usuário já existe com este email')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email }
      })
      expect(prisma.user.create).not.toHaveBeenCalled()
    })
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const hashedPassword = 'hashedPassword123'
      const mockUser = {
        id: 'user-id-123',
        name: 'Test User',
        email: loginData.email,
        password: hashedPassword
      }

      // Mock prisma.user.findUnique (user exists)
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)

      // Mock bcrypt.compare (password is valid)
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

      const result = await AuthService.login(loginData)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email }
      })
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, hashedPassword)
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      })
    })

    it('should throw error if user does not exist', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      }

      // Mock prisma.user.findUnique (user doesn't exist)
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      await expect(AuthService.login(loginData)).rejects.toThrow('Email ou senha inválidos')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email }
      })
      expect(bcrypt.compare).not.toHaveBeenCalled()
    })

    it('should throw error if password is invalid', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      const hashedPassword = 'hashedPassword123'
      const mockUser = {
        id: 'user-id-123',
        name: 'Test User',
        email: loginData.email,
        password: hashedPassword
      }

      // Mock prisma.user.findUnique (user exists)
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)

      // Mock bcrypt.compare (password is invalid)
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

      await expect(AuthService.login(loginData)).rejects.toThrow('Email ou senha inválidos')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email }
      })
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, hashedPassword)
    })
  })
}) 
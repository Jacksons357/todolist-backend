import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { CreateUserRequest, LoginRequest } from '../types'

export class AuthService {
  static async register(userData: CreateUserRequest) {
    const { name, email, password } = userData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('Usuário já existe com este email')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    return user
  }

  static async login(loginData: LoginRequest) {
    const { email, password } = loginData

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error('Email ou senha inválidos')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Email ou senha inválidos')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
} 
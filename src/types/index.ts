import { FastifyRequest } from 'fastify'

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string
    email: string
    name: string
  }
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
}

export interface CreateTodoRequest {
  title: string
  description?: string
  dueDate?: string
  note?: string
  projectId?: string
}

export interface CreateSubtaskRequest {
  title: string
  description?: string
  dueDate?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
} 
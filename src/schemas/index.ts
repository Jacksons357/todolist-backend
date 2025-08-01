import { z } from 'zod'

// User schemas
export const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Nome do projeto é obrigatório'),
  description: z.string().optional()
})

// Todo schemas
export const createTodoSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  note: z.string().optional(),
  projectId: z.string().optional()
})

// Subtask schemas
export const createSubtaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional()
})

// Params schemas
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório')
})

export const todoIdParamSchema = z.object({
  todoId: z.string().min(1, 'ID da tarefa é obrigatório')
})

export const projectIdParamSchema = z.object({
  projectId: z.string().min(1, 'ID do projeto é obrigatório')
}) 
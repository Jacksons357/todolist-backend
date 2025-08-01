import { FastifyReply } from 'fastify'
import { TodoService } from '../services/todo.service'
import { createTodoSchema, idParamSchema } from '../schemas'
import { AuthenticatedRequest } from '../types'

export class TodoController {
  static async createTodo(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const todoData = createTodoSchema.parse(request.body)
      const userId = request.user.id

      const todo = await TodoService.createTodo(userId, todoData)

      reply.status(201).send({
        success: true,
        data: todo,
        message: 'Tarefa criada com sucesso'
      })
    } catch (error: any) {
      if (error.message === 'Projeto não encontrado') {
        reply.status(404).send({
          success: false,
          error: error.message
        })
        return
      }

      reply.status(400).send({
        success: false,
        error: error.message || 'Erro ao criar tarefa'
      })
    }
  }

  static async getUserTodos(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id

      const todos = await TodoService.getUserTodos(userId)

      reply.status(200).send({
        success: true,
        data: todos
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: 'Erro ao buscar tarefas'
      })
    }
  }

  static async completeTodo(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { id } = idParamSchema.parse(request.params)
      const userId = request.user.id

      const todo = await TodoService.completeTodo(userId, id)

      reply.status(200).send({
        success: true,
        data: todo,
        message: todo.completed ? 'Tarefa marcada como concluída' : 'Tarefa marcada como pendente'
      })
    } catch (error: any) {
      if (error.message === 'Tarefa não encontrada') {
        reply.status(404).send({
          success: false,
          error: error.message
        })
        return
      }

      reply.status(500).send({
        success: false,
        error: 'Erro ao atualizar tarefa'
      })
    }
  }

  static async deleteTodo(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { id } = idParamSchema.parse(request.params)
      const userId = request.user.id

      const result = await TodoService.deleteTodo(userId, id)

      reply.status(200).send({
        success: true,
        message: result.message
      })
    } catch (error: any) {
      if (error.message === 'Tarefa não encontrada') {
        reply.status(404).send({
          success: false,
          error: error.message
        })
        return
      }

      reply.status(500).send({
        success: false,
        error: 'Erro ao excluir tarefa'
      })
    }
  }
} 
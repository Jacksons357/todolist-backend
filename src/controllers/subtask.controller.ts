import { FastifyReply } from 'fastify'
import { SubtaskService } from '../services/subtask.service'
import { createSubtaskSchema, idParamSchema, todoIdParamSchema } from '../schemas'
import { AuthenticatedRequest } from '../types'

export class SubtaskController {
  static async createSubtask(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { todoId } = todoIdParamSchema.parse(request.params)
      const subtaskData = createSubtaskSchema.parse(request.body)
      const userId = request.user.id

      const subtask = await SubtaskService.createSubtask(userId, todoId, subtaskData)

      reply.status(201).send({
        success: true,
        data: subtask,
        message: 'Subtarefa criada com sucesso'
      })
    } catch (error: any) {
      if (error.message === 'Tarefa não encontrada') {
        reply.status(404).send({
          success: false,
          error: error.message
        })
        return
      }

      reply.status(400).send({
        success: false,
        error: error.message || 'Erro ao criar subtarefa'
      })
    }
  }

  static async getTodoSubtasks(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { todoId } = todoIdParamSchema.parse(request.params)
      const userId = request.user.id

      const subtasks = await SubtaskService.getTodoSubtasks(userId, todoId)

      reply.status(200).send({
        success: true,
        data: subtasks
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
        error: 'Erro ao buscar subtarefas'
      })
    }
  }

  static async completeSubtask(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { id } = idParamSchema.parse(request.params)
      const userId = request.user.id

      const subtask = await SubtaskService.completeSubtask(userId, id)

      reply.status(200).send({
        success: true,
        data: subtask,
        message: subtask.completed ? 'Subtarefa marcada como concluída' : 'Subtarefa marcada como pendente'
      })
    } catch (error: any) {
      if (error.message === 'Subtarefa não encontrada') {
        reply.status(404).send({
          success: false,
          error: error.message
        })
        return
      }

      reply.status(500).send({
        success: false,
        error: 'Erro ao atualizar subtarefa'
      })
    }
  }

  static async deleteSubtask(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { id } = idParamSchema.parse(request.params)
      const userId = request.user.id

      const result = await SubtaskService.deleteSubtask(userId, id)

      reply.status(200).send({
        success: true,
        message: result.message
      })
    } catch (error: any) {
      if (error.message === 'Subtarefa não encontrada') {
        reply.status(404).send({
          success: false,
          error: error.message
        })
        return
      }

      reply.status(500).send({
        success: false,
        error: 'Erro ao excluir subtarefa'
      })
    }
  }
} 
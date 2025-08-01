import { FastifyReply, FastifyRequest } from 'fastify'
import { ProjectService } from '../services/project.service'
import { createProjectSchema, idParamSchema, projectIdParamSchema } from '../schemas'
import { AuthenticatedRequest } from '../types'

export class ProjectController {
  static async createProject(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const projectData = createProjectSchema.parse(request.body)
      const userId = request.user.id

      const project = await ProjectService.createProject(userId, projectData)

      reply.status(201).send({
        success: true,
        data: project,
        message: 'Projeto criado com sucesso'
      })
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message || 'Erro ao criar projeto'
      })
    }
  }

  static async getUserProjects(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id

      const projects = await ProjectService.getUserProjects(userId)

      reply.status(200).send({
        success: true,
        data: projects
      })
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: 'Erro ao buscar projetos'
      })
    }
  }

  static async deleteProject(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { id } = idParamSchema.parse(request.params)
      const userId = request.user.id

      const result = await ProjectService.deleteProject(userId, id)

      reply.status(200).send({
        success: true,
        message: result.message
      })
    } catch (error: any) {
      if (error.message === 'Projeto não encontrado') {
        reply.status(404).send({
          success: false,
          error: error.message
        })
        return
      }

      reply.status(500).send({
        success: false,
        error: 'Erro ao excluir projeto'
      })
    }
  }

  static async getProjectTodos(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { projectId } = projectIdParamSchema.parse(request.params)
      const userId = request.user.id

      const todos = await ProjectService.getProjectById(userId, projectId)

      reply.status(200).send({
        success: true,
        data: todos
      })
    } catch (error: any) {
      if (error.message === 'Projeto não encontrado') {
        reply.status(404).send({
          success: false,
          error: error.message
        })
        return
      }

      reply.status(500).send({
        success: false,
        error: 'Erro ao buscar tarefas do projeto'
      })
    }
  }
} 
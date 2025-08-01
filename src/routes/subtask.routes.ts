import { FastifyInstance, RouteHandlerMethod } from 'fastify'
import { SubtaskController } from '../controllers/subtask.controller'

export async function subtaskRoutes(fastify: FastifyInstance) {
  // Add authentication to all subtask routes
  fastify.addHook('preHandler', fastify.authenticate)

  fastify.post('/todos/:todoId/subtasks', {
    schema: {
      tags: ['Subtarefas'],
      summary: 'Criar subtarefa',
      description: 'Cria uma nova subtarefa associada a uma tarefa',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['todoId'],
        properties: {
          todoId: {
            type: 'string',
            description: 'ID da tarefa'
          }
        }
      },
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            description: 'Título da subtarefa'
          },
          description: {
            type: 'string',
            description: 'Descrição da subtarefa (opcional)'
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de vencimento (opcional)'
          }
        }
      },
      response: {
        201: {
          description: 'Subtarefa criada com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                dueDate: { type: 'string', format: 'date-time' },
                completed: { type: 'boolean' },
                todoId: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Dados inválidos',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        },
        404: {
          description: 'Tarefa não encontrada',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, SubtaskController.createSubtask as RouteHandlerMethod)

  fastify.get('/todos/:todoId/subtasks', {
    schema: {
      tags: ['Subtarefas'],
      summary: 'Listar subtarefas',
      description: 'Lista todas as subtarefas de uma tarefa específica',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['todoId'],
        properties: {
          todoId: {
            type: 'string',
            description: 'ID da tarefa'
          }
        }
      },
      response: {
        200: {
          description: 'Lista de subtarefas',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  dueDate: { type: 'string', format: 'date-time' },
                  completed: { type: 'boolean' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        404: {
          description: 'Tarefa não encontrada',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, SubtaskController.getTodoSubtasks as RouteHandlerMethod)

  fastify.patch('/subtasks/:id/complete', {
    schema: {
      tags: ['Subtarefas'],
      summary: 'Marcar subtarefa como concluída',
      description: 'Alterna o status de conclusão da subtarefa',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'ID da subtarefa'
          }
        }
      },
      response: {
        200: {
          description: 'Status da subtarefa atualizado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                completed: { type: 'boolean' }
              }
            },
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Subtarefa não encontrada',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, SubtaskController.completeSubtask as RouteHandlerMethod)

  fastify.delete('/subtasks/:id', {
    schema: {
      tags: ['Subtarefas'],
      summary: 'Excluir subtarefa',
      description: 'Exclui uma subtarefa específica',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'ID da subtarefa'
          }
        }
      },
      response: {
        200: {
          description: 'Subtarefa excluída com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Subtarefa não encontrada',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, SubtaskController.deleteSubtask as RouteHandlerMethod)
} 
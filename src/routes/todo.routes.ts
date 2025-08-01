import { FastifyInstance, RouteHandlerMethod } from 'fastify'
import { TodoController } from '../controllers/todo.controller'

export async function todoRoutes(fastify: FastifyInstance) {
  // Add authentication to all todo routes
  fastify.addHook('preHandler', fastify.authenticate)

  fastify.post('/', {
    schema: {
      tags: ['Tarefas'],
      summary: 'Criar tarefa',
      description: 'Cria uma nova tarefa (com ou sem projeto)',
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            description: 'Título da tarefa'
          },
          description: {
            type: 'string',
            description: 'Descrição da tarefa (opcional)'
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de vencimento (opcional)'
          },
          note: {
            type: 'string',
            description: 'Nota adicional (opcional)'
          },
          projectId: {
            type: 'string',
            description: 'ID do projeto (opcional)'
          }
        }
      },
      response: {
        201: {
          description: 'Tarefa criada com sucesso',
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
                note: { type: 'string' },
                completed: { type: 'boolean' },
                project: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' }
                  }
                },
                subtasks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      completed: { type: 'boolean' }
                    }
                  }
                }
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
          description: 'Projeto não encontrado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, TodoController.createTodo as RouteHandlerMethod)

  fastify.get('/', {
    schema: {
      tags: ['Tarefas'],
      summary: 'Listar tarefas',
      description: 'Lista todas as tarefas do usuário logado',
      security: [{ Bearer: [] }],
      response: {
        200: {
          description: 'Lista de tarefas',
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
                  note: { type: 'string' },
                  completed: { type: 'boolean' },
                  project: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' }
                    }
                  },
                  subtasks: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        completed: { type: 'boolean' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, TodoController.getUserTodos as RouteHandlerMethod)

  fastify.get('/:id', {
    schema: {
      tags: ['Tarefas'],
      summary: 'Buscar tarefa por ID',
      description: 'Busca uma tarefa específica pelo ID',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'ID da tarefa'
          }
        }
      },
      response: {
        200: {
          description: 'Tarefa encontrada',
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
                note: { type: 'string' },
                completed: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                project: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' }
                  }
                },
                subtasks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      completed: { type: 'boolean' },
                      createdAt: { type: 'string', format: 'date-time' }
                    }
                  }
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
  }, TodoController.getTodoById as RouteHandlerMethod)

  fastify.patch('/:id', {
    schema: {
      tags: ['Tarefas'],
      summary: 'Atualizar tarefa',
      description: 'Atualiza uma tarefa existente',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'ID da tarefa'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            description: 'Título da tarefa'
          },
          description: {
            type: 'string',
            description: 'Descrição da tarefa (opcional)'
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
            description: 'Data de vencimento (opcional)'
          },
          note: {
            type: 'string',
            description: 'Nota adicional (opcional)'
          },
          projectId: {
            type: 'string',
            description: 'ID do projeto (opcional)'
          }
        }
      },
      response: {
        200: {
          description: 'Tarefa atualizada com sucesso',
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
                note: { type: 'string' },
                completed: { type: 'boolean' },
                project: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' }
                  }
                },
                subtasks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      completed: { type: 'boolean' }
                    }
                  }
                }
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
          description: 'Tarefa ou projeto não encontrado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, TodoController.updateTodo as RouteHandlerMethod)

  fastify.patch('/:id/complete', {
    schema: {
      tags: ['Tarefas'],
      summary: 'Marcar tarefa como concluída',
      description: 'Alterna o status de conclusão da tarefa',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'ID da tarefa'
          }
        }
      },
      response: {
        200: {
          description: 'Status da tarefa atualizado',
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
          description: 'Tarefa não encontrada',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, TodoController.completeTodo as RouteHandlerMethod)

  fastify.delete('/:id', {
    schema: {
      tags: ['Tarefas'],
      summary: 'Excluir tarefa',
      description: 'Exclui uma tarefa e todas as suas subtarefas',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'ID da tarefa'
          }
        }
      },
      response: {
        200: {
          description: 'Tarefa excluída com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
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
  }, TodoController.deleteTodo as RouteHandlerMethod)
} 
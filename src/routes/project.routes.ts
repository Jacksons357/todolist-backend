import { FastifyInstance, RouteHandlerMethod } from 'fastify'
import { ProjectController } from '../controllers/project.controller'

export async function projectRoutes(fastify: FastifyInstance) {
  // Add authentication to all project routes
  fastify.addHook('preHandler', fastify.authenticate)

  fastify.post('/', {
    schema: {
      tags: ['Projetos'],
      summary: 'Criar projeto',
      description: 'Cria um novo projeto para o usuário logado',
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            description: 'Nome do projeto'
          },
          description: {
            type: 'string',
            description: 'Descrição do projeto (opcional)'
          }
        }
      },
      response: {
        201: {
          description: 'Projeto criado com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
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
        }
      }
    }
  }, ProjectController.createProject as RouteHandlerMethod)

  fastify.get('/', {
    schema: {
      tags: ['Projetos'],
      summary: 'Listar projetos',
      description: 'Lista todos os projetos do usuário logado',
      security: [{ Bearer: [] }],
      response: {
        200: {
          description: 'Lista de projetos',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  _count: {
                    type: 'object',
                    properties: {
                      todos: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, ProjectController.getUserProjects as RouteHandlerMethod)

  fastify.get('/:id', {
    schema: {
      tags: ['Projetos'],
      summary: 'Buscar projeto por ID',
      description: 'Busca um projeto específico do usuário logado',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'ID do projeto'
          }
        }
      },
      response: {
        200: {
          description: 'Detalhes do projeto',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                todos: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      completed: { type: 'boolean' },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' },
                      subtasks: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            completed: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
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
  }, ProjectController.getProjectById as RouteHandlerMethod)

  fastify.patch('/:id', {
    schema: {
      tags: ['Projetos'],
      summary: 'Atualizar projeto',
      description: 'Atualiza um projeto específico do usuário logado',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'ID do projeto'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            description: 'Nome do projeto'
          },
          description: {
            type: 'string',
            description: 'Descrição do projeto (opcional)'
          }
        }
      },
      response: {
        200: {
          description: 'Projeto atualizado com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
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
          description: 'Projeto não encontrado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, ProjectController.updateProject as RouteHandlerMethod)

  fastify.delete('/:id', {
    schema: {
      tags: ['Projetos'],
      summary: 'Excluir projeto',
      description: 'Exclui um projeto e todas as suas tarefas e subtarefas',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'ID do projeto'
          }
        }
      },
      response: {
        200: {
          description: 'Projeto excluído com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
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
  }, ProjectController.deleteProject as RouteHandlerMethod)

  fastify.get('/:projectId/todos', {
    schema: {
      tags: ['Projetos'],
      summary: 'Listar tarefas do projeto',
      description: 'Lista todas as tarefas de um projeto específico',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        required: ['projectId'],
        properties: {
          projectId: {
            type: 'string',
            description: 'ID do projeto'
          }
        }
      },
      response: {
        200: {
          description: 'Tarefas do projeto',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                todos: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      completed: { type: 'boolean' },
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
  }, ProjectController.getProjectTodos as RouteHandlerMethod)
} 
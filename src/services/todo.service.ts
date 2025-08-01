import { prisma } from '../lib/prisma'
import { CreateTodoRequest } from '../types'

export class TodoService {
  static async createTodo(userId: string, todoData: CreateTodoRequest) {
    const { title, description, dueDate, note, projectId } = todoData

    // If projectId is provided, verify it belongs to the user
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId
        }
      })

      if (!project) {
        throw new Error('Projeto não encontrado')
      }
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        note,
        projectId,
        userId
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        subtasks: true
      }
    })

    return todo
  }

  static async getUserTodos(userId: string) {
    const todos = await prisma.todo.findMany({
      where: { userId },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        subtasks: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return todos
  }

  static async getTodoById(userId: string, todoId: string) {
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        subtasks: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!todo) {
      throw new Error('Tarefa não encontrada')
    }

    return todo
  }

  static async getProjectTodos(userId: string, projectId: string) {
    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      }
    })

    if (!project) {
      throw new Error('Projeto não encontrado')
    }

    const todos = await prisma.todo.findMany({
      where: {
        userId,
        projectId
      },
      include: {
        subtasks: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return todos
  }

  static async updateTodo(userId: string, todoId: string, updateData: Partial<CreateTodoRequest>) {
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId
      }
    })

    if (!todo) {
      throw new Error('Tarefa não encontrada')
    }

    // If projectId is provided, verify it belongs to the user
    if (updateData.projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: updateData.projectId,
          userId
        }
      })

      if (!project) {
        throw new Error('Projeto não encontrado')
      }
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: todoId
      },
      data: {
        title: updateData.title,
        description: updateData.description,
        dueDate: updateData.dueDate ? new Date(updateData.dueDate) : null,
        note: updateData.note,
        projectId: updateData.projectId
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        subtasks: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    return updatedTodo
  }

  static async completeTodo(userId: string, todoId: string) {
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId
      }
    })

    if (!todo) {
      throw new Error('Tarefa não encontrada')
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: todoId
      },
      data: {
        completed: !todo.completed
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        subtasks: true
      }
    })

    return updatedTodo
  }

  static async deleteTodo(userId: string, todoId: string) {
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId
      }
    })

    if (!todo) {
      throw new Error('Tarefa não encontrada')
    }

    // Delete todo (cascade will delete subtasks)
    await prisma.todo.delete({
      where: {
        id: todoId
      }
    })

    return { message: 'Tarefa excluída com sucesso' }
  }
} 
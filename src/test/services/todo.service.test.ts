import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TodoService } from '../../services/todo.service'
import { prisma } from '../../lib/prisma'

describe('TodoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTodoById', () => {
    it('should return todo with project and subtasks when found', async () => {
      const userId = 'user-id-123'
      const todoId = 'todo-id-123'

      const mockTodo = {
        id: todoId,
        title: 'Test Todo',
        description: 'Test Description',
        dueDate: new Date('2024-01-01'),
        note: 'Test Note',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        projectId: 'project-id-123',
        project: {
          id: 'project-id-123',
          name: 'Test Project'
        },
        subtasks: [
          {
            id: 'subtask-id-1',
            title: 'Subtask 1',
            description: 'Subtask Description',
            completed: false,
            createdAt: new Date()
          }
        ]
      }

      vi.mocked(prisma.todo.findFirst).mockResolvedValue(mockTodo as any)

      const result = await TodoService.getTodoById(userId, todoId)

      expect(prisma.todo.findFirst).toHaveBeenCalledWith({
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
      expect(result).toEqual(mockTodo)
    })

    it('should throw error when todo is not found', async () => {
      const userId = 'user-id-123'
      const todoId = 'nonexistent-todo-id'

      vi.mocked(prisma.todo.findFirst).mockResolvedValue(null)

      await expect(TodoService.getTodoById(userId, todoId)).rejects.toThrow('Tarefa não encontrada')

      expect(prisma.todo.findFirst).toHaveBeenCalledWith({
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
    })

    it('should return todo without project when projectId is null', async () => {
      const userId = 'user-id-123'
      const todoId = 'todo-id-123'

      const mockTodo = {
        id: todoId,
        title: 'Test Todo',
        description: 'Test Description',
        dueDate: null,
        note: null,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        projectId: null,
        project: null,
        subtasks: []
      }

      vi.mocked(prisma.todo.findFirst).mockResolvedValue(mockTodo as any)

      const result = await TodoService.getTodoById(userId, todoId)

      expect(result).toEqual(mockTodo)
      expect(result.project).toBeNull()
    })
  })

  describe('getUserTodos', () => {
    it('should return all user todos with projects and subtasks', async () => {
      const userId = 'user-id-123'

      const mockTodos = [
        {
          id: 'todo-id-1',
          title: 'Todo 1',
          description: 'Description 1',
          dueDate: new Date('2024-01-01'),
          note: 'Note 1',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
          projectId: 'project-id-1',
          project: {
            id: 'project-id-1',
            name: 'Project 1'
          },
          subtasks: []
        },
        {
          id: 'todo-id-2',
          title: 'Todo 2',
          description: 'Description 2',
          dueDate: null,
          note: null,
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
          projectId: null,
          project: null,
          subtasks: [
            {
              id: 'subtask-id-1',
              title: 'Subtask 1',
              completed: true
            }
          ]
        }
      ]

      vi.mocked(prisma.todo.findMany).mockResolvedValue(mockTodos as any)

      const result = await TodoService.getUserTodos(userId)

      expect(prisma.todo.findMany).toHaveBeenCalledWith({
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
      expect(result).toEqual(mockTodos)
    })
  })

  describe('createTodo', () => {
    it('should create todo successfully without project', async () => {
      const userId = 'user-id-123'
      const todoData = {
        title: 'New Todo',
        description: 'New Description',
        dueDate: '2024-01-01T00:00:00.000Z',
        note: 'New Note'
      }

      const mockCreatedTodo = {
        id: 'new-todo-id',
        title: todoData.title,
        description: todoData.description,
        dueDate: new Date(todoData.dueDate),
        note: todoData.note,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        projectId: null,
        project: null,
        subtasks: []
      }

      vi.mocked(prisma.todo.create).mockResolvedValue(mockCreatedTodo as any)

      const result = await TodoService.createTodo(userId, todoData)

      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: {
          title: todoData.title,
          description: todoData.description,
          dueDate: new Date(todoData.dueDate),
          note: todoData.note,
          projectId: undefined,
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
      expect(result).toEqual(mockCreatedTodo)
    })

    it('should create todo successfully with valid project', async () => {
      const userId = 'user-id-123'
      const projectId = 'project-id-123'
      const todoData = {
        title: 'New Todo',
        description: 'New Description',
        projectId
      }

      const mockProject = {
        id: projectId,
        name: 'Test Project',
        userId
      }

      const mockCreatedTodo = {
        id: 'new-todo-id',
        title: todoData.title,
        description: todoData.description,
        dueDate: null,
        note: null,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        projectId,
        project: {
          id: projectId,
          name: 'Test Project'
        },
        subtasks: []
      }

      vi.mocked(prisma.project.findFirst).mockResolvedValue(mockProject as any)
      vi.mocked(prisma.todo.create).mockResolvedValue(mockCreatedTodo as any)

      const result = await TodoService.createTodo(userId, todoData)

      expect(prisma.project.findFirst).toHaveBeenCalledWith({
        where: {
          id: projectId,
          userId
        }
      })
      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: {
          title: todoData.title,
          description: todoData.description,
          dueDate: null,
          note: undefined,
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
      expect(result).toEqual(mockCreatedTodo)
    })

    it('should throw error when project does not exist', async () => {
      const userId = 'user-id-123'
      const projectId = 'nonexistent-project-id'
      const todoData = {
        title: 'New Todo',
        projectId
      }

      vi.mocked(prisma.project.findFirst).mockResolvedValue(null)

      await expect(TodoService.createTodo(userId, todoData)).rejects.toThrow('Projeto não encontrado')

      expect(prisma.project.findFirst).toHaveBeenCalledWith({
        where: {
          id: projectId,
          userId
        }
      })
      expect(prisma.todo.create).not.toHaveBeenCalled()
    })
  })
}) 
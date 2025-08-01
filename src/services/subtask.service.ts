import { prisma } from '../lib/prisma'
import { CreateSubtaskRequest } from '../types'

export class SubtaskService {
  static async createSubtask(userId: string, todoId: string, subtaskData: CreateSubtaskRequest) {
    const { title, description, dueDate } = subtaskData

    // Verify todo belongs to user
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId
      }
    })

    if (!todo) {
      throw new Error('Tarefa não encontrada')
    }

    const subtask = await prisma.subtask.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate + (dueDate.includes('T') ? '' : 'T00:00:00')) : null,
        todoId,
        userId
      }
    })

    return subtask
  }

  static async getTodoSubtasks(userId: string, todoId: string) {
    // Verify todo belongs to user
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId
      }
    })

    if (!todo) {
      throw new Error('Tarefa não encontrada')
    }

    const subtasks = await prisma.subtask.findMany({
      where: {
        todoId,
        userId
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return subtasks
  }

  static async completeSubtask(userId: string, subtaskId: string) {
    const subtask = await prisma.subtask.findFirst({
      where: {
        id: subtaskId,
        userId
      }
    })

    if (!subtask) {
      throw new Error('Subtarefa não encontrada')
    }

    const updatedSubtask = await prisma.subtask.update({
      where: {
        id: subtaskId
      },
      data: {
        completed: !subtask.completed
      }
    })

    return updatedSubtask
  }

  static async deleteSubtask(userId: string, subtaskId: string) {
    const subtask = await prisma.subtask.findFirst({
      where: {
        id: subtaskId,
        userId
      }
    })

    if (!subtask) {
      throw new Error('Subtarefa não encontrada')
    }

    await prisma.subtask.delete({
      where: {
        id: subtaskId
      }
    })

    return { message: 'Subtarefa excluída com sucesso' }
  }
} 
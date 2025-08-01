import { prisma } from '../lib/prisma'
import { CreateProjectRequest } from '../types'

export class ProjectService {
  static async createProject(userId: string, projectData: CreateProjectRequest) {
    const { name, description } = projectData

    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId
      }
    })

    return project
  }

  static async getUserProjects(userId: string) {
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            todos: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return projects
  }

  static async deleteProject(userId: string, projectId: string) {
    // Check if project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      }
    })

    if (!project) {
      throw new Error('Projeto não encontrado')
    }

    // Delete project (cascade will delete todos and subtasks)
    await prisma.project.delete({
      where: {
        id: projectId
      }
    })

    return { message: 'Projeto excluído com sucesso' }
  }

  static async getProjectById(userId: string, projectId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      },
      include: {
        todos: {
          include: {
            subtasks: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!project) {
      throw new Error('Projeto não encontrado')
    }

    return project
  }
} 
import type { Request, Response, NextFunction } from 'express'
import Project, { type IProject } from '../models/Project'
import { NotFoundError, ForbiddenError } from './error'

declare global {
  namespace Express {
    interface Request {
      project?: IProject
    }
  }
}

function memberIdToString(m: unknown): string {
  if (!m) return ''
  if (typeof m === 'string') return m
  if (typeof m === 'object' && m !== null && '_id' in m) {
    return (m as { _id: { toString(): string } })._id.toString()
  }
  if (typeof (m as { toString?: () => string }).toString === 'function') {
    return (m as { toString: () => string }).toString()
  }
  return ''
}

export async function projectExists(req: Request, _res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params
    if (!projectId) return next(new NotFoundError('Project not found'))

    const project = await Project.findById(projectId)
    if (!project) {
      return next(new NotFoundError('Project not found'))
    }

    // Verify the user has access to the project
    if (req.user) {
      const userId = req.user._id.toString()
      const isManager = project.manager?.toString() === userId
      const isTeamMember = project.team.some((m) => memberIdToString(m) === userId)

      if (!isManager && !isTeamMember) {
        return next(new ForbiddenError('You do not have access to this project'))
      }
    }

    req.project = project
    next()
  } catch (error) {
    next(error)
  }
}

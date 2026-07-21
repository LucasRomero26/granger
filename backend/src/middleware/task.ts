import type { Request, Response, NextFunction } from 'express'
import Task, { type ITask } from '../models/Task'
import { NotFoundError, ForbiddenError, BadRequestError } from './error'

declare global {
  namespace Express {
    interface Request {
      task?: ITask
    }
  }
}

export async function taskExists(req: Request, _res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params
    if (!taskId) return next(new NotFoundError('Task not found'))

    const task = await Task.findById(taskId)
    if (!task) {
      return next(new NotFoundError('Task not found'))
    }
    req.task = task
    next()
  } catch (error) {
    next(error)
  }
}

export function taskBelongsToProject(req: Request, _res: Response, next: NextFunction) {
  if (!req.task || !req.project) {
    return next(new BadRequestError('Missing data to validate the task'))
  }
  if (req.task.project.toString() !== req.project._id.toString()) {
    return next(new BadRequestError('Task does not belong to the project'))
  }
  next()
}

export function hasAuthorization(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || !req.project) {
    return next(new ForbiddenError('Forbidden'))
  }
  if (req.user._id.toString() !== req.project.manager?.toString()) {
    return next(new ForbiddenError('Only the project manager can perform this action'))
  }
  next()
}

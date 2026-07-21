import type { Request, Response } from 'express'
import Task from '../models/Task'
import { taskStatus } from '../models/Task'
import { BadRequestError, NotFoundError } from '../middleware/error'

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    const task = new Task(req.body)
    task.project = req.project!._id
    req.project!.tasks.push(task._id)
    await Promise.allSettled([task.save(), req.project!.save()])
    res.status(201).json({ message: 'Task created successfully', task: { _id: task._id, name: task.name, description: task.description, project: task.project, status: task.status, completedBy: [], notes: [] } })
  }

  static getProjectTasks = async (req: Request, res: Response) => {
    const tasks = await Task.find({ project: req.project!._id })
      .populate({ path: 'completedBy.user', select: '_id name email' })
      .populate({ path: 'notes', populate: { path: 'createdBy', select: '_id name email' } })
      .lean()
    res.json(tasks)
  }

  static getTaskById = async (req: Request, res: Response) => {
    const task = await Task.findById(req.task!._id)
      .populate({ path: 'completedBy.user', select: '_id name email' })
      .populate({ path: 'notes', populate: { path: 'createdBy', select: '_id name email' } })
      .lean()
    if (!task) {
      throw new NotFoundError('Task not found')
    }
    res.json(task)
  }

  static updateTask = async (req: Request, res: Response) => {
    const task = req.task!
    task.name = req.body.name
    task.description = req.body.description
    await task.save()
    res.json({ message: 'Task updated' })
  }

  static deleteTask = async (req: Request, res: Response) => {
    const taskId = req.task!._id.toString()
    req.project!.tasks = req.project!.tasks.filter((t) => {
      const id = (t as { toString(): string } | string).toString()
      return id !== taskId
    })
    await Promise.allSettled([req.task!.deleteOne(), req.project!.save()])
    res.json({ message: 'Task deleted' })
  }

  static updateStatus = async (req: Request, res: Response) => {
    const { status } = req.body
    const validStatuses = Object.values(taskStatus)
    if (!validStatuses.includes(status)) {
      throw new BadRequestError('Invalid status')
    }
    req.task!.status = status
    req.task!.completedBy.push({ user: req.user!._id, status })
    await req.task!.save()
    res.json({ message: 'Task updated' })
  }
}

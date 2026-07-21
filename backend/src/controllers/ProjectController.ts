import type { Request, Response } from 'express'
import Project from '../models/Project'
import { NotFoundError, ForbiddenError } from '../middleware/error'

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

function userHasAccess(project: { manager?: unknown; team?: unknown[] }, userId: string): boolean {
  const isManager = memberIdToString(project.manager) === userId
  const isTeamMember = (project.team ?? []).some((m) => memberIdToString(m) === userId)
  return isManager || isTeamMember
}

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body)
    project.manager = req.user!._id
    await project.save()
    res.status(201).json({ message: 'Project created successfully', project: { _id: project._id, projectName: project.projectName, clientName: project.clientName, description: project.description, manager: project.manager, team: [], tasks: [] } })
  }

  static getAllProjects = async (req: Request, res: Response) => {
    const projects = await Project.find({
      $or: [{ manager: req.user!._id }, { team: req.user!._id }],
    })
      .populate({ path: 'manager', select: '_id name email avatar' })
      .populate({ path: 'team', select: '_id name email avatar' })
      .lean()
    res.json(projects)
  }

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params
    const project = await Project.findById(id)
      .populate({
        path: 'tasks',
        populate: [
          { path: 'completedBy.user', select: '_id name email avatar' },
          { path: 'notes', populate: { path: 'createdBy', select: '_id name email avatar' } },
        ],
      })
      .populate({ path: 'manager', select: '_id name email avatar' })
      .populate({ path: 'team', select: '_id name email avatar' })
      .lean()

    if (!project) {
      throw new NotFoundError('Project not found')
    }

    // Authorization: only the manager or a team member can fetch this project.
    // Prevents IDOR (any authenticated user reading any project by _id).
    const userId = req.user!._id.toString()
    if (!userHasAccess(project, userId)) {
      throw new ForbiddenError('You do not have access to this project')
    }

    res.json(project)
  }

  static updateProject = async (req: Request, res: Response) => {
    const project = req.project!
    project.projectName = req.body.projectName
    project.clientName = req.body.clientName
    project.description = req.body.description
    await project.save()
    res.json({ message: 'Project updated' })
  }

  static deleteProject = async (req: Request, res: Response) => {
    await req.project!.deleteOne()
    res.json({ message: 'Project deleted' })
  }
}

import type { Request, Response } from 'express'
import User from '../models/User'
import Project from '../models/Project'
import { NotFoundError, ConflictError, ForbiddenError, BadRequestError } from '../middleware/error'

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

export class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body
    const user = await User.findOne({ email }).select('_id name email avatar')
    if (!user) {
      throw new NotFoundError('User not found')
    }
    res.json(user)
  }

  static getProjectTeam = async (req: Request, res: Response) => {
    const project = await Project.findById(req.project!._id).populate({
      path: 'team',
      select: '_id name email avatar',
    })
    res.json(project?.team ?? [])
  }

  static addMemberById = async (req: Request, res: Response) => {
    const { id } = req.body
    const user = await User.findById(id).select('_id confirmed')
    if (!user) {
      throw new NotFoundError('User not found')
    }
    if (!user.confirmed) {
      throw new BadRequestError('The user has not confirmed their account yet')
    }

    const exists = req.project!.team.some((m) => memberIdToString(m) === id)
    if (exists) {
      throw new ConflictError('The user is already a member of the project')
    }

    req.project!.team.push(user._id)
    await req.project!.save()
    res.json({ message: 'User added to the project' })
  }

  static removeMemberById = async (req: Request, res: Response) => {
    const { userId } = req.params

    const isMember = req.project!.team.some((m) => memberIdToString(m) === userId)
    if (!isMember) {
      throw new ConflictError('The user is not a member of the project')
    }

    // The manager cannot leave their own project
    const managerId = req.project!.manager?.toString() ?? ''
    if (managerId === userId) {
      throw new ForbiddenError('The manager cannot leave their own project')
    }

    req.project!.team = req.project!.team.filter((m) => memberIdToString(m) !== userId)
    await req.project!.save()
    res.json({ message: 'User removed from the project' })
  }
}

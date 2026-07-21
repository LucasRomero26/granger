import type { Project, TeamMember } from '@/types'
import { userIdOf } from '@/types'

export const isManager = (manager: Project['manager'], userId: TeamMember['_id'] | undefined) =>
  userIdOf(manager) === (userId ?? '')

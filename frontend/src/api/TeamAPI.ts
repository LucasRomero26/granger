import { isAxiosError } from 'axios'
import api from '@/lib/axios'
import type { Project, TeamMember, TeamMemberForm } from '@/types'
import { teamMembersSchema } from '@/types'
import { extractMessage } from '@/lib/apiResponse'

export async function findUserByEmail({
  projectId,
  formData,
}: {
  projectId: Project['_id']
  formData: TeamMemberForm
}) {
  try {
    const { data } = await api.post(`/projects/${projectId}/team/find`, formData)
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function addUserToProject({
  projectId,
  id,
}: {
  projectId: Project['_id']
  id: TeamMember['_id']
}) {
  try {
    const { data } = await api.post(`/projects/${projectId}/team`, { id })
    return extractMessage(data, 'Usuario agregado correctamente')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function removeUserFromProject({
  projectId,
  userId,
}: {
  projectId: Project['_id']
  userId: TeamMember['_id']
}) {
  try {
    const { data } = await api.delete(`/projects/${projectId}/team/${userId}`)
    return extractMessage(data, 'Usuario eliminado del proyecto')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function getProjectTeam(projectId: Project['_id']) {
  try {
    const { data } = await api(`/projects/${projectId}/team`)
    const response = teamMembersSchema.safeParse(data)
    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

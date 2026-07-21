import api from '@/lib/axios'
import { isAxiosError } from 'axios'
import type { Project, ProjectFormData } from '@/types'
import { dashboardProjectSchema, editProjectSchema, projectSchema } from '@/types'
import { extractMessage } from '@/lib/apiResponse'

export async function createProject(formData: ProjectFormData) {
  try {
    const { data } = await api.post('/projects', formData)
    return extractMessage(data, 'Proyecto creado')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function getProjects() {
  try {
    const { data } = await api('/projects')
    const response = dashboardProjectSchema.safeParse(data)
    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function getProjectById(id: Project['_id']) {
  try {
    const { data } = await api(`/projects/${id}`)
    const response = editProjectSchema.safeParse(data)
    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function getFullProject(id: Project['_id']) {
  try {
    const { data } = await api(`/projects/${id}`)
    const response = projectSchema.safeParse(data)
    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function updateProject({
  formData,
  projectId,
}: {
  formData: ProjectFormData
  projectId: Project['_id']
}) {
  try {
    const { data } = await api.put(`/projects/${projectId}`, formData)
    return extractMessage(data, 'Proyecto actualizado')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function deleteProject(id: Project['_id']) {
  try {
    const { data } = await api.delete(`/projects/${id}`)
    return extractMessage(data, 'Proyecto eliminado')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

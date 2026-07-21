import { isAxiosError } from 'axios'
import api from '@/lib/axios'
import type { Project, Task, TaskFormData } from '@/types'
import { taskSchema } from '@/types'
import { extractMessage } from '@/lib/apiResponse'

type TaskAPI = {
  formData: TaskFormData
  projectId: Project['_id']
  taskId: Task['_id']
  status: Task['status']
}

export async function createTask({
  formData,
  projectId,
}: Pick<TaskAPI, 'formData' | 'projectId'>) {
  try {
    const { data } = await api.post(`/projects/${projectId}/tasks`, formData)
    return extractMessage(data, 'Tarea creada')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function getTaskById({
  projectId,
  taskId,
}: Pick<TaskAPI, 'projectId' | 'taskId'>) {
  try {
    const { data } = await api(`/projects/${projectId}/tasks/${taskId}`)
    const response = taskSchema.safeParse(data)
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

export async function updateTask({
  projectId,
  taskId,
  formData,
}: Pick<TaskAPI, 'projectId' | 'taskId' | 'formData'>) {
  try {
    const { data } = await api.put(`/projects/${projectId}/tasks/${taskId}`, formData)
    return extractMessage(data, 'Tarea actualizada')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function deleteTask({
  projectId,
  taskId,
}: Pick<TaskAPI, 'projectId' | 'taskId'>) {
  try {
    const { data } = await api.delete(`/projects/${projectId}/tasks/${taskId}`)
    return extractMessage(data, 'Tarea eliminada')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function updateStatus({
  projectId,
  taskId,
  status,
}: Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>) {
  try {
    const { data } = await api.post(`/projects/${projectId}/tasks/${taskId}/status`, {
      status,
    })
    return extractMessage(data, 'Estado actualizado')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

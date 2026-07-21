import { isAxiosError } from 'axios'
import api from '@/lib/axios'
import type { Note, NoteFormData, Project, Task } from '@/types'
import { extractMessage } from '@/lib/apiResponse'

type NoteAPIType = {
  formData: NoteFormData
  projectId: Project['_id']
  taskId: Task['_id']
  noteId: Note['_id']
}

export async function createNote({
  projectId,
  taskId,
  formData,
}: Pick<NoteAPIType, 'projectId' | 'taskId' | 'formData'>) {
  try {
    const { data } = await api.post(
      `/projects/${projectId}/tasks/${taskId}/notes`,
      formData,
    )
    return extractMessage(data, 'Nota creada')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export async function deleteNote({
  projectId,
  taskId,
  noteId,
}: Pick<NoteAPIType, 'projectId' | 'taskId' | 'noteId'>) {
  try {
    const { data } = await api.delete(
      `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`,
    )
    return extractMessage(data, 'Nota eliminada')
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

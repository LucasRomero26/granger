import { z } from 'zod'

const objectIdRegex = /^[0-9a-fA-F]{24}$/

export const createProjectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required').max(200, 'Name is too long').trim(),
  clientName: z.string().min(1, 'Client name is required').max(200, 'Name is too long').trim(),
  description: z.string().min(1, 'Description is required').max(2000, 'Description is too long').trim(),
})

export const updateProjectSchema = createProjectSchema

export const createTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required').max(200, 'Name is too long').trim(),
  description: z.string().min(1, 'Task description is required').max(2000, 'Description is too long').trim(),
})

export const updateTaskSchema = createTaskSchema

export const updateTaskStatusSchema = z.object({
  status: z.enum(['pending', 'onHold', 'inProgress', 'underReview', 'completed'], {
    errorMap: () => ({ message: 'Invalid task status' }),
  }),
})

export const findMemberSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
})

export const addMemberSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Invalid ID'),
})

export const createNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(5000, 'Note is too long').trim(),
})

export const projectIdParamSchema = z.object({
  projectId: z.string().regex(objectIdRegex, 'Invalid project ID'),
})

export const taskIdParamSchema = z.object({
  taskId: z.string().regex(objectIdRegex, 'Invalid task ID'),
})

export const noteIdParamSchema = z.object({
  noteId: z.string().regex(objectIdRegex, 'Invalid note ID'),
})

export const userIdParamSchema = z.object({
  userId: z.string().regex(objectIdRegex, 'Invalid user ID'),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>
export type FindMemberInput = z.infer<typeof findMemberSchema>
export type AddMemberInput = z.infer<typeof addMemberSchema>
export type CreateNoteInput = z.infer<typeof createNoteSchema>

import { z } from 'zod'

const authSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  current_password: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string(),
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type UpdateCurrentUserPasswordForm = Pick<
  Auth,
  'current_password' | 'password' | 'password_confirmation'
>
export type ConfirmToken = Pick<Auth, 'token'>
export type CheckPasswordForm = Pick<Auth, 'password'>

export const userSchema = authSchema
  .pick({ name: true, email: true })
  .extend({
    _id: z.string(),
    avatar: z.string().optional().nullable(),
  })
export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'>

// Referencia a un usuario: puede venir como string (ObjectId) o como objeto populated.
// El backend populariza `manager` y `team`; el demo local usa strings. Aceptamos ambos.
export const userRefSchema = z.union([z.string(), userSchema])
export type UserRef = z.infer<typeof userRefSchema>

// Helper de utilidad para extraer el _id de un UserRef.
export function userIdOf(ref: UserRef | undefined | null): string {
  if (!ref) return ''
  if (typeof ref === 'string') return ref
  return ref._id ?? ''
}

const noteSchema = z.object({
  _id: z.string(),
  content: z.string(),
  createdBy: userSchema,
  task: z.string(),
  createdAt: z.string(),
})
export type Note = z.infer<typeof noteSchema>
export type NoteFormData = Pick<Note, 'content'>

export const taskStatusSchema = z.enum([
  'pending',
  'onHold',
  'inProgress',
  'underReview',
  'completed',
])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  project: z.string(),
  status: taskStatusSchema,
  completedBy: z.array(
    z.object({
      _id: z.string(),
      user: userSchema,
      status: taskStatusSchema,
    }),
  ),
  notes: z.array(noteSchema.extend({ createdBy: userSchema })),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const taskProjectSchema = taskSchema.pick({
  _id: true,
  name: true,
  description: true,
  status: true,
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>
export type TaskProject = z.infer<typeof taskProjectSchema>

export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  manager: userRefSchema,
  tasks: z.array(taskSchema),
  team: z.array(userRefSchema),
})

export const dashboardProjectSchema = z.array(
  projectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    description: true,
    manager: true,
  }),
)

export const editProjectSchema = projectSchema.pick({
  projectName: true,
  clientName: true,
  description: true,
})

export type Project = z.infer<typeof projectSchema>
export type DashboardProject = z.infer<typeof dashboardProjectSchema>[number]
export type ProjectFormData = Pick<Project, 'clientName' | 'projectName' | 'description'>

const teamMemberSchema = userSchema.pick({ name: true, email: true, _id: true })
export const teamMembersSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>

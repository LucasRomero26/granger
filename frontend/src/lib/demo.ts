import type { Note, Project, Task, TeamMember, User } from '@/types'

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

/** Password accepted by the demo login for any known demo account. */
export const DEMO_PASSWORD = 'TestPass123'
/** Extra account the E2E suite signs in with. */
export const DEMO_TEST_EMAIL = 'testlocal@granger.test'

/** Mongo-like 24-char hex id so created records look like real ones. */
function demoObjectId(): string {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

export const DEMO_USER: User = {
  _id: 'demo-user-1',
  name: 'Alex Writer',
  email: 'alex@granger.demo',
}

export const DEMO_COLLABORATOR: User = {
  _id: 'demo-user-2',
  name: 'Jordan Blake',
  email: 'jordan@granger.demo',
}

export const DEMO_MEMBER_3: TeamMember = {
  _id: 'demo-user-3',
  name: 'Sam Rivera',
  email: 'sam@granger.demo',
}

export const DEMO_PROJECT_ID = 'demo-project-1'
export const DEMO_TASK_IDS = {
  pending: 'demo-task-1',
  onHold: 'demo-task-2',
  inProgress: 'demo-task-3',
  underReview: 'demo-task-4',
  completed: 'demo-task-5',
} as const

const now = new Date().toISOString()
const yesterday = new Date(Date.now() - 86400000).toISOString()

export const DEMO_NOTES: Note[] = [
  {
    _id: 'demo-note-1',
    content: 'Keep the glass panels subtle — blur only on the shell.',
    createdBy: DEMO_USER,
    task: DEMO_TASK_IDS.inProgress,
    createdAt: yesterday,
  },
  {
    _id: 'demo-note-2',
    content: 'Accent teal feels more literary than purple.',
    createdBy: DEMO_COLLABORATOR,
    task: DEMO_TASK_IDS.inProgress,
    createdAt: now,
  },
]

export const DEMO_TASKS: Task[] = [
  {
    _id: DEMO_TASK_IDS.pending,
    name: 'Draft project brief',
    description: 'Outline goals, audience, and success metrics for the workspace redesign.',
    project: DEMO_PROJECT_ID,
    status: 'pending',
    completedBy: [],
    notes: [],
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    _id: 'demo-task-1b',
    name: 'Moodboard for glass surfaces',
    description: 'Collect blur, radius, and soft shadow references.',
    project: DEMO_PROJECT_ID,
    status: 'pending',
    completedBy: [],
    notes: [],
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    _id: DEMO_TASK_IDS.onHold,
    name: 'Gather stakeholder feedback',
    description: 'Paused until design review is scheduled.',
    project: DEMO_PROJECT_ID,
    status: 'onHold',
    completedBy: [],
    notes: [],
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    _id: DEMO_TASK_IDS.inProgress,
    name: 'Design Kanban board UI',
    description: 'Glass columns, status colors, and drag-and-drop polish.',
    project: DEMO_PROJECT_ID,
    status: 'inProgress',
    completedBy: [
      { _id: 'log-1', user: DEMO_USER, status: 'pending' },
      { _id: 'log-2', user: DEMO_USER, status: 'inProgress' },
    ],
    notes: DEMO_NOTES,
    createdAt: yesterday,
    updatedAt: now,
  },
  {
    _id: 'demo-task-3b',
    name: 'Create e-mail newsletter layout',
    description: 'Urgent copywriting pass for launch week.',
    project: DEMO_PROJECT_ID,
    status: 'inProgress',
    completedBy: [],
    notes: [],
    createdAt: yesterday,
    updatedAt: now,
  },
  {
    _id: DEMO_TASK_IDS.underReview,
    name: 'Review auth screens',
    description: 'Check typography, OTP input, and color contrast.',
    project: DEMO_PROJECT_ID,
    status: 'underReview',
    completedBy: [],
    notes: [],
    createdAt: yesterday,
    updatedAt: now,
  },
  {
    _id: DEMO_TASK_IDS.completed,
    name: 'Create Granger logo',
    description: 'Geometric folio and nib mark for the brand system.',
    project: DEMO_PROJECT_ID,
    status: 'completed',
    completedBy: [{ _id: 'log-3', user: DEMO_USER, status: 'completed' }],
    notes: [],
    createdAt: yesterday,
    updatedAt: now,
  },
  {
    _id: 'demo-task-5b',
    name: 'Ship motion tokens',
    description: 'Shared easing and duration scale across the product.',
    project: DEMO_PROJECT_ID,
    status: 'completed',
    completedBy: [],
    notes: [],
    createdAt: yesterday,
    updatedAt: now,
  },
]

export const DEMO_PROJECT: Project = {
  _id: DEMO_PROJECT_ID,
  projectName: 'Granger Workspace',
  clientName: 'Studio North',
  description: 'A calm study desk for planning projects, tasks, and team collaboration.',
  manager: DEMO_USER._id,
  tasks: DEMO_TASKS,
  team: [DEMO_USER._id, DEMO_COLLABORATOR._id, DEMO_MEMBER_3._id],
}

export const DEMO_PROJECTS = [
  {
    _id: DEMO_PROJECT_ID,
    projectName: DEMO_PROJECT.projectName,
    clientName: DEMO_PROJECT.clientName,
    description: DEMO_PROJECT.description,
    manager: DEMO_USER._id,
  },
  {
    _id: 'demo-project-2',
    projectName: 'Editorial Calendar',
    clientName: 'Ink & Paper Co.',
    description: 'Quarterly content planning and review pipeline.',
    manager: DEMO_COLLABORATOR._id,
  },
]

export const DEMO_TEAM: TeamMember[] = [
  DEMO_USER,
  DEMO_COLLABORATOR,
  DEMO_MEMBER_3,
]

export const DEMO_SCREENS = [
  { label: 'Login', path: '/auth/login', group: 'Auth' },
  { label: 'Register', path: '/auth/register', group: 'Auth' },
  { label: 'Confirm account', path: '/auth/confirm-account', group: 'Auth' },
  { label: 'Request code', path: '/auth/request-code', group: 'Auth' },
  { label: 'Forgot password', path: '/auth/forgot-password', group: 'Auth' },
  { label: 'New password', path: '/auth/new-password', group: 'Auth' },
  { label: 'Dashboard', path: '/', group: 'App' },
  { label: 'Create project', path: '/projects/create', group: 'App' },
  { label: 'Project board', path: `/projects/${DEMO_PROJECT_ID}`, group: 'App' },
  { label: 'Edit project', path: `/projects/${DEMO_PROJECT_ID}/edit`, group: 'App' },
  { label: 'Team', path: `/projects/${DEMO_PROJECT_ID}/team`, group: 'App' },
  {
    label: 'View task modal',
    path: `/projects/${DEMO_PROJECT_ID}?viewTask=${DEMO_TASK_IDS.inProgress}`,
    group: 'App',
  },
  {
    label: 'New task modal',
    path: `/projects/${DEMO_PROJECT_ID}?newTask=true`,
    group: 'App',
  },
  { label: 'Profile', path: '/profile', group: 'App' },
  { label: 'Change password', path: '/profile/password', group: 'App' },
  { label: '404', path: '/this-page-does-not-exist', group: 'Other' },
] as const

let demoTasks = structuredClone(DEMO_TASKS)
let demoProject = structuredClone(DEMO_PROJECT)
let demoProjects = structuredClone(DEMO_PROJECTS)
let demoTeam = structuredClone(DEMO_TEAM)
let demoUser = structuredClone(DEMO_USER)
/** Full records for projects created during the session (board + team). */
let createdProjects = new Map<string, Project>()

export function resetDemoState() {
  demoTasks = structuredClone(DEMO_TASKS)
  demoProject = structuredClone(DEMO_PROJECT)
  demoProjects = structuredClone(DEMO_PROJECTS)
  demoTeam = structuredClone(DEMO_TEAM)
  demoUser = structuredClone(DEMO_USER)
  createdProjects = new Map()
}

function syncProjectTasks() {
  demoProject.tasks = demoTasks.filter((t) => t.project === demoProject._id)
  for (const project of createdProjects.values()) {
    project.tasks = demoTasks.filter((t) => t.project === project._id)
  }
}

type MockResult = {
  status: number
  data: unknown
}

export function handleDemoRequest(
  method: string,
  url: string,
  body?: unknown,
): MockResult | null {
  const path = url.replace(/^\/+/, '').split('?')[0]
  const m = method.toUpperCase()
  const payload = (body ?? {}) as Record<string, unknown>

  // Auth
  if (m === 'POST' && path === 'auth/login') {
    const email = String(payload.email ?? '')
    const password = String(payload.password ?? '')
    const knownEmails = [demoUser.email, DEMO_TEST_EMAIL, ...demoTeam.map((mbr) => mbr.email)]
    if (!knownEmails.includes(email) || password !== DEMO_PASSWORD) {
      return { status: 401, data: { error: 'Invalid credentials' } }
    }
    return {
      status: 200,
      data: {
        user: { _id: demoUser._id, name: demoUser.name, email: demoUser.email },
        accessToken: 'demo-jwt-token',
      },
    }
  }
  if (m === 'POST' && path === 'auth/refresh') {
    return { status: 200, data: { accessToken: 'demo-jwt-token' } }
  }
  if (m === 'POST' && path === 'auth/logout') {
    return { status: 200, data: { message: 'Logged out' } }
  }
  if (m === 'POST' && path === 'auth/create-account') {
    return { status: 200, data: 'Account created. Check your email to confirm.' }
  }
  if (m === 'POST' && path === 'auth/confirm-account') {
    return { status: 200, data: 'Account confirmed successfully' }
  }
  if (m === 'POST' && path === 'auth/request-code') {
    return { status: 200, data: 'Confirmation code sent' }
  }
  if (m === 'POST' && path === 'auth/forgot-password') {
    return { status: 200, data: 'Password reset instructions sent' }
  }
  if (m === 'POST' && path === 'auth/validate-token') {
    return { status: 200, data: 'Token is valid' }
  }
  if (m === 'POST' && path.startsWith('auth/update-password/')) {
    return { status: 200, data: 'Password updated successfully' }
  }
  if (m === 'GET' && path === 'auth/user') {
    return { status: 200, data: demoUser }
  }
  if (m === 'POST' && path === 'auth/check-password') {
    return { status: 200, data: 'Password verified' }
  }
  if (m === 'PUT' && path === 'auth/profile') {
    demoUser = {
      ...demoUser,
      name: String(payload.name ?? demoUser.name),
      email: String(payload.email ?? demoUser.email),
    }
    return { status: 200, data: 'Profile updated' }
  }
  if (m === 'POST' && path === 'auth/update-password') {
    return { status: 200, data: 'Password changed' }
  }

  // Projects
  if (m === 'GET' && path === 'projects') {
    return { status: 200, data: demoProjects }
  }
  if (m === 'POST' && path === 'projects') {
    const created: Project = {
      _id: demoObjectId(),
      projectName: String(payload.projectName ?? 'New project'),
      clientName: String(payload.clientName ?? 'Client'),
      description: String(payload.description ?? ''),
      manager: demoUser._id,
      tasks: [],
      team: [],
    }
    createdProjects.set(created._id, created)
    demoProjects = [
      {
        _id: created._id,
        projectName: created.projectName,
        clientName: created.clientName,
        description: created.description,
        manager: demoUser._id,
      },
      ...demoProjects,
    ]
    return { status: 200, data: 'Project created' }
  }
  if (m === 'GET' && path.startsWith('projects/') && !path.includes('/tasks') && !path.includes('/team')) {
    const id = path.split('/')[1]
    if (id === DEMO_PROJECT_ID || id === demoProject._id) {
      syncProjectTasks()
      return { status: 200, data: demoProject }
    }
    const created = createdProjects.get(id)
    if (created) {
      syncProjectTasks()
      return { status: 200, data: created }
    }
    const listed = demoProjects.find((p) => p._id === id)
    if (listed) {
      return {
        status: 200,
        data: {
          projectName: listed.projectName,
          clientName: listed.clientName,
          description: listed.description,
        },
      }
    }
  }
  if (m === 'PUT' && path.startsWith('projects/') && path.split('/').length === 2) {
    const id = path.split('/')[1]
    demoProjects = demoProjects.map((p) =>
      p._id === id
        ? {
            ...p,
            projectName: String(payload.projectName ?? p.projectName),
            clientName: String(payload.clientName ?? p.clientName),
            description: String(payload.description ?? p.description),
          }
        : p,
    )
    if (id === demoProject._id) {
      demoProject = {
        ...demoProject,
        projectName: String(payload.projectName ?? demoProject.projectName),
        clientName: String(payload.clientName ?? demoProject.clientName),
        description: String(payload.description ?? demoProject.description),
      }
    }
    const created = createdProjects.get(id)
    if (created) {
      created.projectName = String(payload.projectName ?? created.projectName)
      created.clientName = String(payload.clientName ?? created.clientName)
      created.description = String(payload.description ?? created.description)
    }
    return { status: 200, data: 'Project updated' }
  }
  if (m === 'DELETE' && path.startsWith('projects/') && path.split('/').length === 2) {
    const id = path.split('/')[1]
    demoProjects = demoProjects.filter((p) => p._id !== id)
    createdProjects.delete(id)
    return { status: 200, data: 'Project deleted' }
  }

  // Tasks
  if (m === 'POST' && /projects\/[^/]+\/tasks$/.test(path)) {
    const task: Task = {
      _id: demoObjectId(),
      name: String(payload.name ?? 'New task'),
      description: String(payload.description ?? ''),
      project: path.split('/')[1],
      status: 'pending',
      completedBy: [],
      notes: [],
      createdAt: now,
      updatedAt: now,
    }
    demoTasks = [task, ...demoTasks]
    syncProjectTasks()
    return { status: 200, data: 'Task created' }
  }
  if (m === 'GET' && /projects\/[^/]+\/tasks\/[^/]+$/.test(path)) {
    const taskId = path.split('/')[3]
    const task = demoTasks.find((t) => t._id === taskId)
    if (task) return { status: 200, data: task }
  }
  if (m === 'PUT' && /projects\/[^/]+\/tasks\/[^/]+$/.test(path)) {
    const taskId = path.split('/')[3]
    demoTasks = demoTasks.map((t) =>
      t._id === taskId
        ? {
            ...t,
            name: String(payload.name ?? t.name),
            description: String(payload.description ?? t.description),
            updatedAt: new Date().toISOString(),
          }
        : t,
    )
    syncProjectTasks()
    return { status: 200, data: 'Task updated' }
  }
  if (m === 'DELETE' && /projects\/[^/]+\/tasks\/[^/]+$/.test(path)) {
    const taskId = path.split('/')[3]
    demoTasks = demoTasks.filter((t) => t._id !== taskId)
    syncProjectTasks()
    return { status: 200, data: 'Task deleted' }
  }
  if (m === 'POST' && /projects\/[^/]+\/tasks\/[^/]+\/status$/.test(path)) {
    const taskId = path.split('/')[3]
    const status = String(payload.status)
    demoTasks = demoTasks.map((t) =>
      t._id === taskId
        ? {
            ...t,
            status: status as Task['status'],
            updatedAt: new Date().toISOString(),
            completedBy: [
              ...t.completedBy,
              {
                _id: `log-${Date.now()}`,
                user: demoUser,
                status: status as Task['status'],
              },
            ],
          }
        : t,
    )
    syncProjectTasks()
    return { status: 200, data: 'Status updated' }
  }

  // Notes
  if (m === 'POST' && /projects\/[^/]+\/tasks\/[^/]+\/notes$/.test(path)) {
    const taskId = path.split('/')[3]
    const note: Note = {
      _id: demoObjectId(),
      content: String(payload.content ?? ''),
      createdBy: demoUser,
      task: taskId,
      createdAt: new Date().toISOString(),
    }
    demoTasks = demoTasks.map((t) =>
      t._id === taskId ? { ...t, notes: [note, ...t.notes] } : t,
    )
    return { status: 200, data: 'Note created' }
  }
  if (m === 'DELETE' && /projects\/[^/]+\/tasks\/[^/]+\/notes\/[^/]+$/.test(path)) {
    const parts = path.split('/')
    const taskId = parts[3]
    const noteId = parts[5]
    demoTasks = demoTasks.map((t) =>
      t._id === taskId ? { ...t, notes: t.notes.filter((n) => n._id !== noteId) } : t,
    )
    return { status: 200, data: 'Note deleted' }
  }

  // Team
  if (m === 'GET' && /projects\/[^/]+\/team$/.test(path)) {
    return { status: 200, data: demoTeam }
  }
  if (m === 'POST' && /projects\/[^/]+\/team\/find$/.test(path)) {
    const email = String(payload.email ?? '')
    const found =
      demoTeam.find((mbr) => mbr.email === email) ??
      ({
        _id: 'demo-found-user',
        name: 'Casey Morgan',
        email,
      } satisfies TeamMember)
    return { status: 200, data: found }
  }
  if (m === 'POST' && /projects\/[^/]+\/team$/.test(path)) {
    const id = String(payload.id ?? '')
    if (!demoTeam.some((mbr) => mbr._id === id)) {
      demoTeam = [
        ...demoTeam,
        { _id: id, name: 'Casey Morgan', email: 'casey@granger.demo' },
      ]
    }
    return { status: 200, data: 'Member added' }
  }
  if (m === 'DELETE' && /projects\/[^/]+\/team\/[^/]+$/.test(path)) {
    const userId = path.split('/')[3]
    demoTeam = demoTeam.filter((mbr) => mbr._id !== userId)
    return { status: 200, data: 'Member removed' }
  }

  return { status: 404, data: { error: `Demo mock missing for ${m} /${path}` } }
}

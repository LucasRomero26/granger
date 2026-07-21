import { Router } from 'express'
import { ProjectController } from '../controllers/ProjectController'
import { TaskController } from '../controllers/TaskController'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'
import { authenticate } from '../middleware/auth'
import { projectExists } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task'
import { validateBody, validateParams } from '../middleware/validateHelpers'
import { asyncHandler } from '../middleware/asyncHandler'
import {
  createProjectSchema,
  updateProjectSchema,
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  findMemberSchema,
  addMemberSchema,
  createNoteSchema,
  taskIdParamSchema,
  noteIdParamSchema,
  userIdParamSchema,
} from '../schemas/projectSchema'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Project CRUD (do not need projectExists since they are the resource entry point)
router.post('/', validateBody(createProjectSchema), asyncHandler(ProjectController.createProject))
router.get('/', asyncHandler(ProjectController.getAllProjects))
router.get('/:id', asyncHandler(ProjectController.getProjectById))

// From here on, projectExists is applied to every route with :projectId
router.use('/:projectId', projectExists)

router.put('/:projectId', validateBody(updateProjectSchema), hasAuthorization, asyncHandler(ProjectController.updateProject))
router.delete('/:projectId', hasAuthorization, asyncHandler(ProjectController.deleteProject))

// Tasks
router.post('/:projectId/tasks', hasAuthorization, validateBody(createTaskSchema), asyncHandler(TaskController.createTask))
router.get('/:projectId/tasks', asyncHandler(TaskController.getProjectTasks))

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId', validateParams(taskIdParamSchema), asyncHandler(TaskController.getTaskById))
router.put('/:projectId/tasks/:taskId', hasAuthorization, validateBody(updateTaskSchema), asyncHandler(TaskController.updateTask))
router.delete('/:projectId/tasks/:taskId', hasAuthorization, asyncHandler(TaskController.deleteTask))
router.post('/:projectId/tasks/:taskId/status', validateBody(updateTaskStatusSchema), asyncHandler(TaskController.updateStatus))

// Team
router.post('/:projectId/team/find', validateBody(findMemberSchema), asyncHandler(TeamMemberController.findMemberByEmail))
router.get('/:projectId/team', asyncHandler(TeamMemberController.getProjectTeam))
router.post('/:projectId/team', hasAuthorization, validateBody(addMemberSchema), asyncHandler(TeamMemberController.addMemberById))
router.delete('/:projectId/team/:userId', validateParams(userIdParamSchema), hasAuthorization, asyncHandler(TeamMemberController.removeMemberById))

// Notes
router.post('/:projectId/tasks/:taskId/notes', validateBody(createNoteSchema), asyncHandler(NoteController.createNote))
router.get('/:projectId/tasks/:taskId/notes', asyncHandler(NoteController.getTaskNotes))
router.delete('/:projectId/tasks/:taskId/notes/:noteId', validateParams(noteIdParamSchema), asyncHandler(NoteController.deleteNote))

export default router

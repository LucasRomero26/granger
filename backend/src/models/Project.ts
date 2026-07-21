import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose'
import { ITask } from './Task'
import { IUser } from './User'

export interface IProject extends Document {
  projectName: string
  clientName: string
  description: string
  tasks: PopulatedDoc<ITask & Document>[]
  manager: PopulatedDoc<IUser & Document>
  team: PopulatedDoc<IUser & Document>[]
}

const projectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: 'Task',
      },
    ],
    manager: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    team: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
)

projectSchema.index({ manager: 1, projectName: 1 })

projectSchema.pre('deleteOne', { document: true, query: false }, async function (this: IProject) {
  const projectId = this._id
  if (!projectId) return

  // Lazy import to avoid a circular dependency
  const Task = (await import('./Task')).default
  const Note = (await import('./Note')).default

  const tasks = await Task.find({ project: projectId })
  for (const task of tasks) {
    await Note.deleteMany({ task: task._id })
  }
  await Task.deleteMany({ project: projectId })
})

const Project = mongoose.model<IProject>('Project', projectSchema)
export default Project

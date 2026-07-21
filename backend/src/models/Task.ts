import mongoose, { Schema, Document, Types } from 'mongoose'

export const taskStatus = {
  PENDING: 'pending',
  ON_HOLD: 'onHold',
  IN_PROGRESS: 'inProgress',
  UNDER_REVIEW: 'underReview',
  COMPLETED: 'completed',
} as const

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus]

export interface ITask extends Document {
  name: string
  description: string
  project: Types.ObjectId
  status: TaskStatus
  completedBy: {
    user: Types.ObjectId
    status: TaskStatus
  }[]
  notes: Types.ObjectId[]
}

const taskSchema: Schema = new Schema(
  {
    name: {
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
    project: {
      type: Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING,
      index: true,
    },
    completedBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: 'User',
          default: null,
        },
        status: {
          type: String,
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING,
        },
      },
    ],
    notes: [
      {
        type: Types.ObjectId,
        ref: 'Note',
      },
    ],
  },
  { timestamps: true },
)

taskSchema.index({ project: 1, status: 1 })

taskSchema.pre('deleteOne', { document: true, query: false }, async function (this: ITask) {
  const taskId = this._id
  if (!taskId) return
  const Note = (await import('./Note')).default
  await Note.deleteMany({ task: taskId })
})

const Task = mongoose.model<ITask>('Task', taskSchema)
export default Task

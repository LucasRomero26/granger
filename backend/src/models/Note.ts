import mongoose, { Schema, Document, Types } from 'mongoose'

export interface INote extends Document {
  content: string
  createdBy: Types.ObjectId
  task: Types.ObjectId
}

const noteSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: {
      type: Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
  },
  { timestamps: true },
)

noteSchema.index({ task: 1, createdAt: -1 })

const Note = mongoose.model<INote>('Note', noteSchema)
export default Note

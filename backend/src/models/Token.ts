import mongoose, { Schema, Document } from 'mongoose'

export interface IToken extends Document {
  token: string
  user: mongoose.Types.ObjectId
  type: 'email_confirmation' | 'password_reset'
  expiresAt: Date
}

const tokenSchema: Schema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['email_confirmation', 'password_reset'],
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
      expires: 600, // 10 minutes
    },
  },
  { timestamps: true },
)

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token

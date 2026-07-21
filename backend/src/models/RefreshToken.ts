import mongoose, { Schema, Document } from 'mongoose'

export interface IRefreshToken extends Document {
  token: string
  user: mongoose.Types.ObjectId
  expiresAt: Date
  revoked: boolean
  revokedAt?: Date
  replacedBy?: string
}

const refreshTokenSchema: Schema = new Schema(
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
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // TTL: the document is automatically deleted upon expiry
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    replacedBy: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema)
export default RefreshToken

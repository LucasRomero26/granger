import mongoose, { Schema, Document } from 'mongoose'

export type AuthProvider = 'local' | 'google' | 'github'

export interface IUser extends Document {
  email: string
  password?: string
  name: string
  confirmed: boolean
  avatar?: string | null
  avatarPublicId?: string | null
  provider: AuthProvider
  providerId?: string | null
  lastLoginAt?: Date | null
  loginAttempts: number
  lockUntil?: Date | null
  isLocked: boolean
  incrementLoginAttempts(): Promise<IUser>
  resetLoginAttempts(): Promise<IUser>
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    avatarPublicId: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },
    providerId: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.virtual('isLocked').get(function (this: IUser) {
  return !!(this.lockUntil && this.lockUntil.getTime() > Date.now())
})

userSchema.methods.incrementLoginAttempts = async function (this: IUser) {
  if (this.lockUntil && this.lockUntil.getTime() < Date.now()) {
    this.loginAttempts = 1
    this.lockUntil = null
  } else {
    this.loginAttempts += 1
    if (this.loginAttempts >= 5 && !this.isLocked) {
      this.lockUntil = new Date(Date.now() + 15 * 60 * 1000)
    }
  }
  return this.save({ validateBeforeSave: false })
}

userSchema.methods.resetLoginAttempts = async function (this: IUser) {
  this.loginAttempts = 0
  this.lockUntil = null
  this.lastLoginAt = new Date()
  return this.save({ validateBeforeSave: false })
}

const User = mongoose.model<IUser>('User', userSchema)
export default User

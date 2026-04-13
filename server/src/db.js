import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    provider: { type: String, enum: ['email-otp', 'google'], default: 'email-otp' },
    googleId: { type: String, default: '' },
  },
  { timestamps: true }
)

const otpCodeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
)

otpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const OtpCode = mongoose.models.OtpCode || mongoose.model('OtpCode', otpCodeSchema)

const storeStateSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    cartItems: { type: [mongoose.Schema.Types.Mixed], default: [] },
    orders: { type: [mongoose.Schema.Types.Mixed], default: [] },
    wishlistItems: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
)

export const StoreState = mongoose.models.StoreState || mongoose.model('StoreState', storeStateSchema)

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error('Set MONGODB_URI in server/.env before starting the auth server.')
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  return mongoose.connect(uri)
}

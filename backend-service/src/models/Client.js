import mongoose from 'mongoose'

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true })

clientSchema.index({ email: 1 }, { unique: true })

export default mongoose.model('Client', clientSchema)



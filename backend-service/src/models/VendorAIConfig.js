import mongoose from 'mongoose'

const vendorAIConfigSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  systemPrompt: { type: String, default: 'You are a helpful vendor assistant.' },
  modelName: { type: String, default: 'gemini-2.5-flash' },
  temperature: { type: Number, default: 0.4 },
}, { timestamps: true })

vendorAIConfigSchema.index({ vendorId: 1 }, { unique: true })

export default mongoose.model('VendorAIConfig', vendorAIConfigSchema)



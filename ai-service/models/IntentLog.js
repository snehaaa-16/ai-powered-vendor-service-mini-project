import mongoose from 'mongoose'

const intentLogSchema = new mongoose.Schema({
  source: { type: String, enum: ['search', 'chat'], required: true },
  sourceId: { type: String },
  rawText: { type: String, required: true },
  parsed: { type: Object, default: {} },
  vendorName: { type: String }
}, { timestamps: true })

const IntentLog = mongoose.model('IntentLog', intentLogSchema)

export default IntentLog



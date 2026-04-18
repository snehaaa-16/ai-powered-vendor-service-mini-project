import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, unique: true, index: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  lastMessageAt: { type: Date, default: Date.now },
  summary: { type: [String], default: [] }
}, { timestamps: true })

const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation



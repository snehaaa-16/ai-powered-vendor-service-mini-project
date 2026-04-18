import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, index: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)

export default Message



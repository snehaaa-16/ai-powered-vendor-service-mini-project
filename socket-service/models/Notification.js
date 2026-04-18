import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', index: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', index: true },
  type: { type: String, enum: ['chat_summary', 'vendor_accept'], required: true },
  payload: { type: Object, default: {} },
  status: { type: String, enum: ['queued', 'sent'], default: 'queued' }
}, { timestamps: true })

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification



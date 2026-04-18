import mongoose from 'mongoose'

const agreementSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, index: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', index: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', index: true },
  // Keep summary/timeline as simple text, but allow structured budget/scope objects
  summary: { type: String },
  budget: { type: mongoose.Schema.Types.Mixed },
  timeline: { type: String },
  // Scope can be a nested object (frontend/backend/features/etc.), so allow any shape
  scope: { type: mongoose.Schema.Types.Mixed },
  // Optional contact details explicitly shared by client (email/WhatsApp etc.)
  contactDetails: { type: String },
  status: {
    type: String,
    enum: ['proposed', 'client_agreed', 'vendor_accepted'],
    default: 'proposed'
  }
}, { timestamps: true })

const Agreement = mongoose.model('Agreement', agreementSchema)

export default Agreement

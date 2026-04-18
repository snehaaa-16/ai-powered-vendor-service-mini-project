import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  discountPercent: { type: Number, default: 0 },
  validityStart: { type: Date },
  validityEnd: { type: Date },
  status: { type: String, enum: ['draft', 'approved', 'sent'], default: 'draft' }
}, { timestamps: true })

const Offer = mongoose.model('Offer', offerSchema)

export default Offer



import mongoose from 'mongoose'

// Minimal vendor schema for email + basic info lookup
const vendorSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  location: {
    city: String,
    state: String,
    country: String,
  },
}, { collection: 'vendors' })

const Vendor = mongoose.model('Vendor', vendorSchema)

export default Vendor



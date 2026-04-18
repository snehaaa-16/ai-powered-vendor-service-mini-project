import mongoose from 'mongoose'

// Minimal client schema for email + name lookup
const clientSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
}, { collection: 'clients' })

const Client = mongoose.model('Client', clientSchema)

export default Client



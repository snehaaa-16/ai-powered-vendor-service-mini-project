import mongoose from 'mongoose'

export async function connectMongo(uri) {
  if (mongoose.connection.readyState === 1) return mongoose.connection
  const conn = await mongoose.connect(uri)
  return conn
}



import jwt from 'jsonwebtoken'
import Client from '../models/Client.js'
import Vendor from '../models/Vendor.js'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('Missing required environment variable: JWT_SECRET')
  }
  return secret
}

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret())
    
    // Get user data from database
    const Model = decoded.role === 'vendor' ? Vendor : Client
    const user = await Model.findById(decoded.id).select('-password')
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = {
      id: user._id,
      role: decoded.role,
      name: user.name,
      email: user.email,
      ...(decoded.role === 'vendor' && {
        vendorType: user.vendorType,
        isVerified: user.isVerified,
        location: user.location
      })
    }
    
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    return res.status(500).json({ message: 'Token verification failed' })
  }
}

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return next()
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret())
    
    // Get user data from database
    const Model = decoded.role === 'vendor' ? Vendor : Client
    const user = await Model.findById(decoded.id).select('-password')
    
    if (user) {
      req.user = {
        id: user._id,
        role: decoded.role,
        name: user.name,
        email: user.email,
        ...(decoded.role === 'vendor' && {
          vendorType: user.vendorType,
          isVerified: user.isVerified,
          location: user.location
        })
      }
    }
    
    next()
  } catch (error) {
    // If token is invalid, just continue without user
    next()
  }
}

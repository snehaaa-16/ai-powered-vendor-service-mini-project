import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Vendor from '../models/Vendor.js'
import Client from '../models/Client.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('Missing required environment variable: JWT_SECRET')
  }
  return secret
}

function modelFor(role) {
  return role === 'vendor' ? Vendor : Client
}

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({ 
      success: true, 
      user: req.user 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get user info', 
      error: error.message 
    })
  }
})

router.post('/register',
  body('role').isIn(['vendor', 'client']),
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('phone').isString().notEmpty(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { role, name, email, phone, password, vendorType, location } = req.body
    
    // Add console logging for vendor registration
    if (role === 'vendor') {
      console.log('=== VENDOR REGISTRATION DATA RECEIVED ===')
      console.log('Basic Info:', { name, email, phone, vendorType })
      console.log('Location:', location)
      console.log('Full Request Body:', JSON.stringify(req.body, null, 2))
    }
    
    try {
      const Model = modelFor(role)
      const exists = await Model.findOne({ email })
      if (exists) return res.status(409).json({ message: 'Email already registered' })
      const hashed = await bcrypt.hash(password, 10)
      
      const vendorData = role === 'vendor'
        ? { name, email, phone, password: hashed, vendorType: vendorType || 'individual', location: location || { city: 'Unknown', state: 'Unknown', country: 'Unknown' } }
        : { name, email, phone, password: hashed }
      
      // Log the data being saved to database
      if (role === 'vendor') {
        console.log('=== VENDOR DATA BEING SAVED TO DATABASE ===')
        console.log('Vendor Data (without password):', { ...vendorData, password: '[HIDDEN]' })
      }
      
      const doc = await Model.create(vendorData)
      
      // Log the saved document
      if (role === 'vendor') {
        console.log('=== VENDOR SAVED TO DATABASE ===')
        console.log('Saved Vendor ID:', doc._id)
        console.log('Saved Vendor Data:', JSON.stringify(doc.toObject(), null, 2))
      }
      
      const token = jwt.sign({ id: doc._id, role }, getJwtSecret(), { expiresIn: '7d' })
      res.status(201).json({ 
        success: true,
        token, 
        user: { 
          id: doc._id, 
          role, 
          name: doc.name, 
          email: doc.email,
          ...(role === 'vendor' && {
            vendorType: doc.vendorType,
            location: doc.location
          })
        } 
      })
    } catch (e) {
      console.error('=== VENDOR REGISTRATION ERROR ===')
      console.error('Error:', e.message)
      console.error('Stack:', e.stack)
      res.status(500).json({ message: 'Registration failed', error: e.message })
    }
  }
)

router.post('/login',
  body('role').isIn(['vendor', 'client']),
  body('email').isEmail(),
  body('password').isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { role, email, password } = req.body
    try {
      // Check both collections to find the user and verify their actual role
      const vendorUser = await Vendor.findOne({ email })
      const clientUser = await Client.findOne({ email })
      
      let user = null
      let actualRole = null
      
      if (vendorUser) {
        user = vendorUser
        actualRole = 'vendor'
      } else if (clientUser) {
        user = clientUser
        actualRole = 'client'
      }
      
      // User doesn't exist in either collection
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      
      // User exists but selected wrong role
      if (actualRole !== role) {
        return res.status(403).json({ 
          message: `This email is registered as a ${actualRole}. Please select the correct role.` 
        })
      }
      
      // Verify password
      const ok = await bcrypt.compare(password, user.password)
      if (!ok) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      
      // Generate token with correct role
      const token = jwt.sign({ id: user._id, role: actualRole }, getJwtSecret(), { expiresIn: '7d' })
      
      res.json({ 
        success: true,
        token, 
        user: { 
          id: user._id, 
          role: actualRole, 
          name: user.name, 
          email: user.email,
          ...(actualRole === 'vendor' && {
            vendorType: user.vendorType,
            location: user.location
          })
        } 
      })
    } catch (e) {
      res.status(500).json({ message: 'Login failed', error: e.message })
    }
  }
)

// Vendor profile update route
router.post('/vendor/profile', authenticateToken, async (req, res) => {
  try {
    // Verify user is a vendor
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied. Vendor role required.' })
    }

    const { skills, services, portfolio, availability, bio, website } = req.body
    
    console.log('=== VENDOR PROFILE UPDATE DATA RECEIVED ===')
    console.log('Vendor ID:', req.user.id)
         console.log('Skills:', skills)
     console.log('Services:', services)
     console.log('Portfolio:', portfolio)
     console.log('Availability:', availability)
    console.log('Bio:', bio)
    console.log('Website:', website)
    console.log('Full Request Body:', JSON.stringify(req.body, null, 2))

    // Prepare update data
    const updateData = {}
    
    if (skills && Array.isArray(skills)) {
      updateData.skills = skills
    }
    
    if (services && Array.isArray(services)) {
      updateData.services = services
    }
    
         if (portfolio && Array.isArray(portfolio)) {
       updateData.portfolio = portfolio
     }
    
    if (availability && typeof availability === 'object') {
      updateData.availabilityStatus = availability.availableForProjects ? 'available' : 'unavailable'
      updateData.responseTime = availability.responseTime
      updateData.workingHours = availability.workingHours
      updateData.location = {
        ...req.user.location,
        timezone: availability.timeZone
      }
    }
    
    if (bio) {
      updateData.profile = { bio }
    }
    
    if (website) {
      updateData.profile = { ...updateData.profile, website }
    }

    console.log('=== VENDOR PROFILE UPDATE DATA TO BE SAVED ===')
    console.log('Update Data:', JSON.stringify(updateData, null, 2))

    // Update vendor in database
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' })
    }

    console.log('=== VENDOR PROFILE UPDATED SUCCESSFULLY ===')
    console.log('Updated Vendor Data:', JSON.stringify(updatedVendor.toObject(), null, 2))

    res.json({
      success: true,
      message: 'Vendor profile updated successfully',
      vendor: {
        id: updatedVendor._id,
        name: updatedVendor.name,
        email: updatedVendor.email,
        vendorType: updatedVendor.vendorType,
        skills: updatedVendor.skills,
        services: updatedVendor.services,
        portfolio: updatedVendor.portfolio,
        location: updatedVendor.location,
        profile: updatedVendor.profile
      }
    })

  } catch (error) {
    console.error('=== VENDOR PROFILE UPDATE ERROR ===')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update vendor profile', 
      error: error.message 
    })
  }
})

export default router



import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import Vendor from '../models/Vendor.js'

const router = Router()

router.post('/step-1',
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('phone').isString().notEmpty(),
  body('vendorType').optional().isIn(['individual', 'agency', 'startup', 'Individual', 'Company']),
  body('address').optional().isObject(),
  body('address.city').optional().isString(),
  body('address.state').optional().isString(),
  body('address.country').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { name, email, phone, vendorType, address } = req.body
    try {
      const exists = await Vendor.findOne({ email })
      if (exists) return res.status(409).json({ message: 'Email already registered' })
      const v = await Vendor.create({
        name,
        email,
        phone,
        vendorType: vendorType || 'individual',
        address: address || {},
        location: { city: address?.city || '', state: address?.state || '', country: address?.country || '' },
        registration: { step: 1, completed: false }
      })
      res.status(201).json({ id: v._id, step: 1 })
    } catch (e) {
      res.status(500).json({ message: 'Failed to create vendor', error: e.message })
    }
  }
)

router.put('/step-2/:id',
  body('technicalInterests').isArray().custom(arr => arr.every(s => typeof s === 'string')),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
      const v = await Vendor.findByIdAndUpdate(
        req.params.id,
        { $set: { technicalInterests: req.body.technicalInterests, 'registration.step': 2 } },
        { new: true }
      )
      if (!v) return res.status(404).json({ message: 'Vendor not found' })
      res.json({ id: v._id, step: 2 })
    } catch (e) {
      res.status(500).json({ message: 'Failed to save preferences', error: e.message })
    }
  }
)

// Step 3: Services & Pricing
router.put('/step-3/:id',
  body('services').isArray(),
  body('services.*.name').isString().notEmpty(),
  body('services.*.description').optional().isString(),
  body('services.*.minPrice').optional().isNumeric(),
  body('services.*.maxPrice').optional().isNumeric(),
  body('services.*.currency').optional().isString(),
  body('services.*.duration').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
      const v = await Vendor.findByIdAndUpdate(
        req.params.id,
        { $set: { services: req.body.services, 'registration.step': 3 } },
        { new: true }
      )
      if (!v) return res.status(404).json({ message: 'Vendor not found' })
      res.json({ id: v._id, step: 3 })
    } catch (e) {
      res.status(500).json({ message: 'Failed to save services', error: e.message })
    }
  }
)

// Step 4: Portfolio Projects
router.put('/step-4/:id',
  body('portfolio').isArray(),
  body('portfolio.*.title').isString().notEmpty(),
  body('portfolio.*.description').optional().isString(),
  body('portfolio.*.projectUrl').optional().isURL().optional({ nullable: true }),
  body('portfolio.*.technologies').optional().isArray(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
      const v = await Vendor.findByIdAndUpdate(
        req.params.id,
        { $set: { portfolio: req.body.portfolio, 'registration.step': 4 } },
        { new: true }
      )
      if (!v) return res.status(404).json({ message: 'Vendor not found' })
      res.json({ id: v._id, step: 4 })
    } catch (e) {
      res.status(500).json({ message: 'Failed to save portfolio', error: e.message })
    }
  }
)

// Step 5: Availability & Preferences
router.put('/step-5/:id',
  body('availabilityStatus').isIn(['available', 'busy', 'limited', 'unavailable']),
  body('responseTime').optional().isString(),
  body('workingHours').optional().isString(),
  body('timeZone').optional().isString(),
  body('communicationPreferences').optional().isArray(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
      const update = {
        availabilityStatus: req.body.availabilityStatus,
        responseTime: req.body.responseTime,
        workingHours: req.body.workingHours,
        preferredCommunication: req.body.communicationPreferences,
        'registration.step': 5,
        'registration.completed': true,
        profileCompletionDate: new Date()
      }
      const v = await Vendor.findByIdAndUpdate(req.params.id, { $set: update }, { new: true })
      if (!v) return res.status(404).json({ message: 'Vendor not found' })
      res.json({ id: v._id, step: 5, completed: true })
    } catch (e) {
      res.status(500).json({ message: 'Failed to save availability', error: e.message })
    }
  }
)

export default router



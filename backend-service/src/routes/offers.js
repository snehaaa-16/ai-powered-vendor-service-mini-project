import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import Offer from '../models/Offer.js'
import Vendor from '../models/Vendor.js'

const router = Router()

// List offers for a vendor
router.get('/:vendorId', authenticateToken, async (req, res) => {
  try {
    const { vendorId } = req.params
    const offers = await Offer.find({ vendorId }).sort({ createdAt: -1 })
    return res.json({ success: true, offers })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
})

// Create a draft offer manually
router.post('/:vendorId', authenticateToken, async (req, res) => {
  try {
    const { vendorId } = req.params
    const doc = await Offer.create({ vendorId, ...(req.body || {}) })
    return res.status(201).json({ success: true, offer: doc })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
})

// Generate a basic draft offer from vendor services (correctness-first)
router.post('/:vendorId/generate', authenticateToken, async (req, res) => {
  try {
    const { vendorId } = req.params
    const v = await Vendor.findById(vendorId).lean()
    if (!v) return res.status(404).json({ success: false, error: 'Vendor not found' })
    const topService = (v.services || [])[0]
    const title = topService?.name ? `${topService.name} - Limited Offer` : 'Special Offer'
    const priceRange = topService ? `${topService.minPrice || ''}-${topService.maxPrice || ''} ${topService.currency || 'INR'}` : ''
    const body = topService
      ? `Get ${topService.name} starting at ${priceRange}. Duration: ${topService.duration || 'N/A'}.`
      : 'Exclusive discount on our services for a limited time.'
    const offer = await Offer.create({ vendorId, title, body, discountPercent: 10, status: 'draft' })
    return res.status(201).json({ success: true, offer })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
})

export default router



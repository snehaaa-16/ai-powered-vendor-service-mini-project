import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import Vendor from '../models/Vendor.js'

const router = Router()

// Client submits a rating (1-5) for a vendor
router.post('/:vendorId/rating', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ success: false, error: 'Client role required' })
    }

    const { vendorId } = req.params
    let { rating } = req.body

    rating = Number(rating)
    if (!Number.isFinite(rating)) {
      return res.status(400).json({ success: false, error: 'Rating must be a number' })
    }

    // Clamp between 1 and 5
    rating = Math.max(1, Math.min(5, rating))

    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return res.status(404).json({ success: false, error: 'Vendor not found' })
    }

    const currentAverage = vendor.rating?.average || 0
    const currentTotal = vendor.rating?.totalReviews || 0

    const newTotal = currentTotal + 1
    const newAverage = (currentAverage * currentTotal + rating) / newTotal

    vendor.rating = {
      average: Number(newAverage.toFixed(2)),
      totalReviews: newTotal,
    }

    await vendor.save()

    return res.json({
      success: true,
      rating: vendor.rating,
    })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
})

export default router



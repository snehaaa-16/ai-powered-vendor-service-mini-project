import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import VendorAIConfig from '../models/VendorAIConfig.js'

const router = Router()

// Get AI config for vendor
router.get('/:vendorId', authenticateToken, async (req, res) => {
  try {
    const { vendorId } = req.params
    const config = await VendorAIConfig.findOne({ vendorId })
    return res.json({ success: true, config })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
})

// Upsert AI config for vendor (vendor-only or admin)
router.put('/:vendorId', authenticateToken, async (req, res) => {
  try {
    const { vendorId } = req.params
    const updates = req.body || {}
    const config = await VendorAIConfig.findOneAndUpdate(
      { vendorId },
      { $set: updates, vendorId },
      { upsert: true, new: true }
    )
    return res.json({ success: true, config })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
})

export default router



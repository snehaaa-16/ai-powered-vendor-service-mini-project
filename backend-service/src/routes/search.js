import express from 'express'
import axios from 'axios'
import Vendor from '../models/Vendor.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

const AI_BASE_URL = process.env.AI_BASE_URL || 'http://localhost:3002'

function ensureAIBaseUrl(res) {
  if (!AI_BASE_URL) {
    res.status(503).json({ 
      success: false, 
      error: 'AI service not configured' 
    })
    return null
  }
  return AI_BASE_URL
}

const aiServiceClient = axios.create({
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

aiServiceClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      return Promise.reject({ 
        status: 503, 
        message: 'AI service is currently unavailable. Please try again later.' 
      })
    } else if (error.code === 'ETIMEDOUT') {
      return Promise.reject({ 
        status: 504, 
        message: 'AI service request timed out. Please try again.' 
      })
    } else if (error.response) {
      return Promise.reject({ 
        status: error.response.status, 
        message: error.response.data?.error || error.response.data?.message || 'AI service error' 
      })
    } else {
      return Promise.reject({ 
        status: 500, 
        message: 'Failed to connect to AI service' 
      })
    }
  }
)

router.get('/skill-search', async (req, res) => {
  try {
    const baseUrl = ensureAIBaseUrl(res)
    if (!baseUrl) return
    
    const r = await aiServiceClient.get(`${baseUrl}/api/skill-search`, { 
      params: req.query 
    })
    res.status(r.status).json(r.data)
  } catch (error) {
    res.status(error.status || 500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

router.get('/suggest', async (req, res) => {
  try {
    const baseUrl = ensureAIBaseUrl(res)
    if (!baseUrl) return
    
    const r = await aiServiceClient.get(`${baseUrl}/api/suggest`, { 
      params: req.query 
    })
    res.status(r.status).json(r.data)
  } catch (error) {
    res.status(error.status || 500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

router.post('/advanced-filter', async (req, res) => {
  try {
    const baseUrl = ensureAIBaseUrl(res)
    if (!baseUrl) return
    
    const r = await aiServiceClient.post(`${baseUrl}/api/advanced-filter`, req.body)
    res.status(r.status).json(r.data)
  } catch (error) {
    res.status(error.status || 500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

router.post('/smart-search', async (req, res) => {
  try {
    const baseUrl = ensureAIBaseUrl(res)
    if (!baseUrl) return
    
    const r = await aiServiceClient.post(`${baseUrl}/api/smart-search`, req.body)
    res.status(r.status).json(r.data)
  } catch (error) {
    res.status(error.status || 500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

// Get vendor by ID directly from database
router.get('/vendor/:id', authenticateToken, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select('-password')
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vendor not found' 
      })
    }

    res.json({ 
      success: true, 
      vendor: vendor 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

router.get('/status', async (req, res) => {
  try {
    const baseUrl = ensureAIBaseUrl(res)
    if (!baseUrl) return
    
    const r = await aiServiceClient.get(`${baseUrl}/api/status`)
    res.status(r.status).json(r.data)
  } catch (error) {
    res.status(error.status || 500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

router.post('/refresh-index', async (req, res) => {
  try {
    const baseUrl = ensureAIBaseUrl(res)
    if (!baseUrl) return
    
    const r = await aiServiceClient.post(`${baseUrl}/api/refresh-index`)
    res.status(r.status).json(r.data)
  } catch (error) {
    res.status(error.status || 500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

router.get('/ranking-weights', async (req, res) => {
  try {
    const baseUrl = ensureAIBaseUrl(res)
    if (!baseUrl) return
    
    const r = await aiServiceClient.get(`${baseUrl}/api/ranking-weights`)
    res.status(r.status).json(r.data)
  } catch (error) {
    res.status(error.status || 500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

router.get('/locations/search', async (req, res) => {
  try {
    const baseUrl = ensureAIBaseUrl(res)
    if (!baseUrl) return
    
    const r = await aiServiceClient.get(`${baseUrl}/api/locations/search`, { 
      params: req.query 
    })
    res.status(r.status).json(r.data)
  } catch (error) {
    res.status(error.status || 500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

router.get('/locations/nearby', async (req, res) => {
  try {
    const baseUrl = ensureAIBaseUrl(res)
    if (!baseUrl) return
    
    const r = await aiServiceClient.get(`${baseUrl}/api/locations/nearby`, { 
      params: req.query 
    })
    res.status(r.status).json(r.data)
  } catch (error) {
    res.status(error.status || 500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

export default router



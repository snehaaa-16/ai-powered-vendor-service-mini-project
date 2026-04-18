import express from 'express'
import searchEngine from '../services/searchEngine.js'
import locationService from '../services/locationService.js'
import rankingService from '../services/rankingService.js'

const router = express.Router()

router.get('/skill-search', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        error: 'Search query must be at least 2 characters long' 
      })
    }
    
    // Manual search returns all matching results with relevance scoring
    const results = await searchEngine.searchBySkills(q.trim(), parseInt(page), parseInt(limit))
    
    res.json({
      success: true,
      ...results,
      searchInfo: {
        type: 'manual',
        description: 'Relevance-based search showing all matching vendors'
      }
    })
  } catch (error) {
    console.error('Skill search error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Search failed. Please try again.' 
    })
  }
})

router.get('/suggest', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query
    
    if (!q || q.trim().length < 1) {
      const popularSkills = await searchEngine.getPopularSkills(parseInt(limit))
      return res.json({ 
        success: true,
        suggestions: popularSkills 
      })
    }
    
    const suggestions = await searchEngine.getSearchSuggestions(q.trim(), parseInt(limit))
    
    res.json({
      success: true,
      suggestions
    })
  } catch (error) {
    console.error('Suggestion error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to get suggestions' 
    })
  }
})

router.post('/advanced-filter', async (req, res) => {
  try {
    const { skills, location, rating, availability, priceRange, page = 1, limit = 20 } = req.body
    
    const filters = { isActive: true }
    
    if (skills && skills.length > 0) {
      // Handle multiple skills with OR condition (match ANY of the skills)
      const skillConditions = skills.map(skill => ({
        'skills.name': { $regex: skill.trim(), $options: 'i' }
      }))
      filters.$or = skillConditions
    }
    
    if (location && location.city) {
      filters['location.city'] = new RegExp(location.city, 'i')
    }
    
    if (rating && rating > 0) {
      filters['rating.average'] = { $gte: parseFloat(rating) }
    }
    
    if (availability) {
      // Support both boolean and string availability filters
      if (availability === 'available' || availability === true) {
        filters.$or = filters.$or || []
        filters.$and = [
          ...(filters.$and || []),
          {
            $or: [
              { availabilityStatus: 'available' },
              { availability: 'immediate' },
              { availability: 'within_week' }
            ]
          }
        ]
      } else if (availability === 'immediate') {
        filters.availability = 'immediate'
      }
    }
    
    if (priceRange) {
      if (priceRange.min !== undefined || priceRange.max !== undefined) {
        const priceConditions = []
        if (priceRange.max) {
          priceConditions.push({ 'services.minPrice': { $lte: priceRange.max } })
        }
        if (priceRange.min) {
          priceConditions.push({ 'services.maxPrice': { $gte: priceRange.min } })
        }
        if (priceConditions.length > 0) {
          filters.$and = [...(filters.$and || []), ...priceConditions]
        }
      }
    }
    
    console.log('🔍 Advanced filter conditions:', JSON.stringify(filters, null, 2))
    
    // Advanced filter returns ALL matching results (paginated)
    const vendors = await searchEngine.searchWithFilters(filters, parseInt(page), parseInt(limit))
    
    res.json({
      success: true,
      ...vendors,
      searchInfo: {
        type: 'advanced',
        description: 'Advanced filter search showing all matching vendors based on your criteria'
      }
    })
  } catch (error) {
    console.error('Advanced filter error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Advanced filter failed. Please try again.' 
    })
  }
})

router.post('/smart-search', async (req, res) => {
  try {
    const { requirement } = req.body
    
    // AI search always returns best 5 matches - ignore user-provided limit
    const AI_SEARCH_LIMIT = 5
    
    if (!requirement || requirement.trim().length < 10) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide a detailed requirement (at least 10 characters)' 
      })
    }
    
    // AI search is always page 1 with fixed limit of 5 best matches
    const results = await searchEngine.smartSearch(requirement.trim(), 1, AI_SEARCH_LIMIT)
    
    res.json({
      success: true,
      ...results,
      searchInfo: {
        type: 'ai',
        maxResults: AI_SEARCH_LIMIT,
        description: 'AI-powered search returns the top 5 best-matched vendors based on your requirements'
      }
    })
  } catch (error) {
    console.error('Smart search error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Smart search failed. Please try again.' 
    })
  }
})

router.get('/vendor/:id', async (req, res) => {
  try {
    const { id } = req.params
    const vendor = await searchEngine.getVendorById(id)
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false,
        error: 'Vendor not found' 
      })
    }
    
    res.json({
      success: true,
      vendor
    })
  } catch (error) {
    console.error('Vendor fetch error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch vendor details' 
    })
  }
})

router.get('/status', async (req, res) => {
  try {
    const status = await searchEngine.getStatus()
    res.json({
      success: true,
      status
    })
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to get search engine status' 
    })
  }
})

router.post('/refresh-index', async (req, res) => {
  try {
    await searchEngine.refreshIndexes()
    res.json({
      success: true,
      message: 'Search indexes refreshed successfully'
    })
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to refresh indexes' 
    })
  }
})

router.get('/ranking-weights', async (req, res) => {
  try {
    const weights = await rankingService.getWeights()
    res.json({
      success: true,
      weights
    })
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to get ranking weights' 
    })
  }
})

router.get('/locations/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query
    const locations = await locationService.searchLocations(q, parseInt(limit))
    
    res.json({
      success: true,
      locations
    })
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Location search failed' 
    })
  }
})

router.get('/locations/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50, limit = 20 } = req.query
    const locations = await locationService.getNearbyLocations(
      parseFloat(lat), 
      parseFloat(lng), 
      parseInt(radius), 
      parseInt(limit)
    )
    
    res.json({
      success: true,
      locations
    })
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Nearby location search failed' 
    })
  }
})

export default router 
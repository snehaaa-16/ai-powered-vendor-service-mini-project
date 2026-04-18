import trieService from './trieService.js';
import classificationService from './classificationService.js';
import rankingService from './rankingService.js';
import geminiSearchService from './geminiSearchService.js';
import { Vendor } from '../models/index.js';
import SearchQuery from '../models/searchQuery.js'
import IntentLog from '../models/IntentLog.js'

class SearchEngine {
  constructor() {
    this.trieService = trieService;
    this.classificationService = classificationService;
    this.rankingService = rankingService;
    this.geminiSearchService = geminiSearchService;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      const vendors = await Vendor.find({ isActive: true });
      await this.trieService.initialize(vendors);
      this.isInitialized = true;
      console.log(`✅ Search Engine initialized with ${vendors.length} vendors`);
    } catch (error) {
      console.error('❌ Search Engine initialization error:', error);
      throw error;
    }
  }

  async searchBySkills(query, page = 1, limit = 10) {
    try {
      const normalizedQuery = query.toLowerCase().trim()
      console.log(`🔍 Manual Search for: "${normalizedQuery}"`)
      
      // Break down the query into individual words, filter out stop words
      const stopWords = ['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'are', 'with', 'need', 'want', 'looking', 'find', 'search', 'developer', 'expert', 'specialist', 'professional']
      const queryWords = normalizedQuery
        .split(/\s+/)
        .filter(word => word.length > 1 && !stopWords.includes(word))
      
      console.log(`🔍 Query words (filtered): [${queryWords.join(', ')}]`)
      
      // If all words were filtered out, use original query
      const searchWords = queryWords.length > 0 ? queryWords : [normalizedQuery]
      
      let searchConditions = { isActive: true }
      
      if (searchWords.length === 1) {
        // Single word search - broad matching
        const word = searchWords[0]
        searchConditions.$or = [
          { 'skills.name': { $regex: word, $options: 'i' } },
          { 'services.name': { $regex: word, $options: 'i' } },
          { name: { $regex: word, $options: 'i' } },
          { 'profile.bio': { $regex: word, $options: 'i' } }
        ]
      } else {
        // Multi-word search - Google-style: prefer matches on ALL terms, but include partial matches
        // Build condition: match vendors that have AT LEAST ONE match, then rank by relevance
        const wordConditions = []
        
        searchWords.forEach(word => {
          wordConditions.push(
            { 'skills.name': { $regex: word, $options: 'i' } },
            { 'services.name': { $regex: word, $options: 'i' } },
            { name: { $regex: word, $options: 'i' } },
            { 'profile.bio': { $regex: word, $options: 'i' } }
          )
        })
        
        searchConditions.$or = wordConditions
      }
      
      // Fetch more candidates for relevance scoring
      const CANDIDATE_MULTIPLIER = 5
      const candidateLimit = Math.min(limit * CANDIDATE_MULTIPLIER, 100)
      
      let candidates = await Vendor.find(searchConditions)
        .select('-password -__v')
        .lean()
      
      const total = candidates.length
      console.log(`📊 Found ${total} candidates for relevance ranking`)
      
      // Apply relevance scoring to all candidates
      const scoredVendors = candidates.map(vendor => {
        const relevanceScore = this.rankingService.calculateRelevanceScore(vendor, normalizedQuery, searchWords)
        
        // Calculate match details for transparency
        const vendorSkillNames = (vendor.skills || []).map(s => 
          (typeof s === 'string' ? s : s.name || '').toLowerCase()
        )
        
        // Count how many search words match
        const matchedWords = searchWords.filter(word => {
          const wordLower = word.toLowerCase()
          return vendorSkillNames.some(s => s.includes(wordLower) || wordLower.includes(s)) ||
                 (vendor.services || []).some(s => (s.name || '').toLowerCase().includes(wordLower)) ||
                 (vendor.name || '').toLowerCase().includes(wordLower) ||
                 (vendor.profile?.bio || '').toLowerCase().includes(wordLower)
        })
        
        return {
          ...vendor,
          relevanceScore: Math.round(relevanceScore * 100) / 100,
          relevancePercentage: Math.round(relevanceScore * 100),
          matchedTerms: matchedWords,
          matchCount: matchedWords.length,
          totalTerms: searchWords.length
        }
      })
      
      // Sort by relevance score (highest first), then by rating as tiebreaker
      scoredVendors.sort((a, b) => {
        // Primary sort: relevance score
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore
        }
        // Secondary sort: match count (more matched terms = better)
        if (b.matchCount !== a.matchCount) {
          return b.matchCount - a.matchCount
        }
        // Tertiary sort: rating
        const ratingA = a.rating?.average || a.rating || 0
        const ratingB = b.rating?.average || b.rating || 0
        return ratingB - ratingA
      })
      
      // Apply pagination to sorted results
      const startIndex = (page - 1) * limit
      const paginatedVendors = scoredVendors.slice(startIndex, startIndex + limit)
      
      console.log(`✅ Returning ${paginatedVendors.length} vendors (page ${page}/${Math.ceil(total / limit)})`)
      if (paginatedVendors.length > 0) {
        console.log(`   Top match: ${paginatedVendors[0].name} (relevance: ${paginatedVendors[0].relevancePercentage}%, matched ${paginatedVendors[0].matchCount}/${searchWords.length} terms)`)
      }
      
      // Log search query
      if (this.isInitialized) {
        try {
          await this.logSearchQuery(query, { vendors: paginatedVendors, total });
        } catch (logError) {
          console.error('⚠️ Failed to log search query (non-critical):', logError.message);
        }
      }
      
      return {
        vendors: paginatedVendors,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        query: normalizedQuery,
        queryWords: searchWords,
        searchType: 'manual'
      }
    } catch (error) {
      console.error('❌ Search error details:', error);
      throw new Error(`Search failed: ${error.message}`)
    }
  }

  async searchWithFilters(filters, page = 1, limit = 10) {
    try {
      const vendors = await Vendor.find(filters)
        .sort({ 'rating.average': -1, 'rating.totalReviews': -1, isVerified: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-password -__v')
        .lean()

      const total = await Vendor.countDocuments(filters)
      
      return {
        vendors,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new Error(`Filter search failed: ${error.message}`)
    }
  }

  async smartSearch(requirement, page = 1, limit = 5) {
    try {
      // AI search always returns best 5 matches maximum
      const AI_SEARCH_LIMIT = 5
      
      const analysis = await this.geminiSearchService.analyzeRequirement(requirement)
      try {
        await IntentLog.create({ source: 'search', sourceId: 'smart-search', rawText: requirement, parsed: analysis })
      } catch {}
      
      const searchTerms = analysis.requiredSkills || []
      const mustHaveSkills = analysis.skillPriority?.must_have || []
      const niceToHaveSkills = analysis.skillPriority?.nice_to_have || []
      const allSkills = [...new Set([...mustHaveSkills, ...niceToHaveSkills, ...searchTerms])]
      
      console.log(`🤖 AI Search - Analyzing: "${requirement}"`)
      console.log(`🎯 Extracted skills: [${allSkills.join(', ')}]`)
      console.log(`⚡ Availability requirement: ${analysis.availability?.required || 'flexible'} (urgency: ${analysis.availability?.urgency || 'medium'})`)
      
      // Build flexible query - fetch more candidates for ranking
      const CANDIDATE_LIMIT = 50  // Fetch more candidates for proper ranking
      const orConditions = []

      // Match on skills (any of them to get candidates)
      if (allSkills.length > 0) {
        allSkills.forEach(term => {
          orConditions.push({ 'skills.name': { $regex: term, $options: 'i' } })
        })
      }

      // Also match on services
      if (allSkills.length > 0) {
        allSkills.forEach(term => {
          orConditions.push({ 'services.name': { $regex: term, $options: 'i' } })
        })
      }

      const searchConditions = {
        isActive: true,
        ...(orConditions.length > 0 ? { $or: orConditions } : {})
      }
      
      // Fetch more candidates for ranking
      let candidates = await Vendor.find(searchConditions)
        .select('-password -__v')
        .lean()
      
      console.log(`📊 Found ${candidates.length} initial candidates`)
      
      // If we got candidates, apply ranking
      if (candidates.length > 0) {
        // Apply ranking based on analysis
        const rankedVendors = this.rankingService.rankVendors(candidates, analysis)
        
        // Apply additional filters to ranked results
        let filteredVendors = rankedVendors
        
        // Budget filter (soft filter - don't exclude, just deprioritize)
        const budgetAmount = analysis.budget?.amount || 0
        if (budgetAmount > 0) {
          filteredVendors = filteredVendors.map(vendor => {
            const hasAffordableService = vendor.services?.some(s => 
              (s.minPrice && s.minPrice <= budgetAmount) || 
              (s.maxPrice && s.maxPrice <= budgetAmount)
            )
            if (!hasAffordableService) {
              return { ...vendor, matchScore: vendor.matchScore * 0.8 }  // 20% penalty
            }
            return vendor
          })
        }
        
        // Location filter (soft filter)
        if (analysis.location) {
          const reqLocation = analysis.location.toLowerCase()
          filteredVendors = filteredVendors.map(vendor => {
            const vendorCity = vendor.location?.city?.toLowerCase() || ''
            const vendorState = vendor.location?.state?.toLowerCase() || ''
            if (!vendorCity.includes(reqLocation) && !vendorState.includes(reqLocation) && !reqLocation.includes(vendorCity)) {
              return { ...vendor, matchScore: vendor.matchScore * 0.9 }  // 10% penalty
            }
            return vendor
          })
        }
        
        // Re-sort after adjustments
        filteredVendors.sort((a, b) => b.matchScore - a.matchScore)
        
        // Take top AI_SEARCH_LIMIT results
        const topMatches = filteredVendors.slice(0, AI_SEARCH_LIMIT)
        
        console.log(`✨ Returning top ${topMatches.length} matches:`)
        topMatches.forEach((v, i) => {
          console.log(`   ${i + 1}. ${v.name} - Score: ${v.matchPercentage}% (Availability: ${v.availabilityStatus || v.availability})`)
        })
        
        return {
          vendors: topMatches,
          pagination: {
            page: 1,
            limit: AI_SEARCH_LIMIT,
            total: topMatches.length,
            pages: 1
          },
          analysis,
          query: requirement,
          searchType: 'ai',
          totalCandidates: candidates.length
        }
      }
      
      // No candidates found with skills, try broader search
      console.log('⚠️ No skill matches, trying broader search...')
      const broadCandidates = await Vendor.find({ isActive: true })
        .sort({ 'rating.average': -1, isVerified: -1 })
        .limit(CANDIDATE_LIMIT)
        .select('-password -__v')
        .lean()
      
      const rankedBroad = this.rankingService.rankVendors(broadCandidates, analysis)
      const topBroadMatches = rankedBroad.slice(0, AI_SEARCH_LIMIT)
      
      return {
        vendors: topBroadMatches,
        pagination: {
          page: 1,
          limit: AI_SEARCH_LIMIT,
          total: topBroadMatches.length,
          pages: 1
        },
        analysis,
        query: requirement,
        searchType: 'ai',
        totalCandidates: broadCandidates.length,
        note: 'No exact skill matches found, showing best available vendors'
      }
    } catch (error) {
      console.error('Smart search error:', error)
      throw new Error(`Smart search failed: ${error.message}`)
    }
  }

  async getVendorById(id) {
    try {
      const vendor = await Vendor.findById(id)
        .select('-password -__v')
        .lean()
      
      return vendor
    } catch (error) {
      throw new Error(`Failed to fetch vendor: ${error.message}`)
    }
  }

  async getStatus() {
    return {
      isInitialized: this.isInitialized,
      geminiService: this.geminiSearchService.getStatus(),
      timestamp: new Date().toISOString()
    }
  }

  async refreshIndexes() {
    try {
      await Vendor.collection.createIndex({ 'skills.name': 'text' })
      await Vendor.collection.createIndex({ 'services.name': 'text' })
      await Vendor.collection.createIndex({ 'location.city': 1 })
      await Vendor.collection.createIndex({ 'rating.average': -1 })
      await Vendor.collection.createIndex({ isActive: 1 })
      
      return { success: true, message: 'Indexes refreshed successfully' }
    } catch (error) {
      throw new Error(`Failed to refresh indexes: ${error.message}`)
    }
  }

  async logSearchQuery(query, results) {
    try {
      // Only log if we have valid data
      if (!query || typeof query !== 'string') {
        console.log('⚠️ Skipping search log - invalid query');
        return;
      }

      const searchQuery = new SearchQuery({
        query: query,
        resultCount: results.total || results.vendors?.length || 0,
        searchTimestamp: new Date(),
        sessionId: 'system',
        searchType: 'skill'
      });
      
      await searchQuery.save();
      console.log(`📝 Logged search query: "${query}" with ${results.total || 0} results`);
    } catch (error) {
      console.error('⚠️ Failed to log search query (non-critical):', error.message);
      // Don't throw error as this is not critical
    }
  }

  async getSearchSuggestions(query, limit = 10) {
    try {
      const normalizedQuery = query.toLowerCase().trim()
      
      if (normalizedQuery.length < 1) {
        return await this.getPopularSkills(limit)
      }
      
      // Get suggestions from skills that match the query
      const skillSuggestions = await Vendor.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$skills' },
        { $match: { 'skills.name': { $regex: normalizedQuery, $options: 'i' } } },
        { $group: { _id: '$skills.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit }
      ])
      
      // Get suggestions from services that match the query
      const serviceSuggestions = await Vendor.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$services' },
        { $match: { 'services.name': { $regex: normalizedQuery, $options: 'i' } } },
        { $group: { _id: '$services.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit }
      ])
      
      // Combine and deduplicate suggestions
      const allSuggestions = new Set()
      
      skillSuggestions.forEach(s => allSuggestions.add(s._id))
      serviceSuggestions.forEach(s => allSuggestions.add(s._id))
      
      // Add common skill combinations if query is short
      if (normalizedQuery.length < 3) {
        const commonCombinations = [
          'React Developer', 'Node.js Developer', 'Full Stack Developer',
          'Mobile App Developer', 'UI/UX Designer', 'DevOps Engineer',
          'Data Scientist', 'Machine Learning Engineer', 'Blockchain Developer',
          'WordPress Developer', 'E-commerce Developer', 'API Developer'
        ]
        
        commonCombinations.forEach(combo => {
          if (combo.toLowerCase().includes(normalizedQuery)) {
            allSuggestions.add(combo)
          }
        })
      }
      
      return Array.from(allSuggestions).slice(0, limit)
    } catch (error) {
      console.error('Search suggestions error:', error)
      return []
    }
  }

  async getPopularSkills(limit = 20) {
    try {
      const popularSkills = await Vendor.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$skills' },
        { $group: { _id: '$skills.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit }
      ])
      
      return popularSkills.map(s => s._id)
    } catch (error) {
      return []
    }
  }
}

const searchEngine = new SearchEngine();

export default searchEngine; 
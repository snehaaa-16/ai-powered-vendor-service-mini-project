class RankingService {
  constructor() {
    this.defaultWeights = {
      skillMatch: 0.35,
      availability: 0.25,
      experience: 0.20,
      rating: 0.10,
      location: 0.10
    }
  }

  async getWeights() {
    return this.defaultWeights
  }

  async updateWeights(newWeights) {
    this.defaultWeights = { ...this.defaultWeights, ...newWeights }
    return { success: true, weights: this.defaultWeights }
  }

  /**
   * Rank vendors based on analysis criteria with proper scoring
   * @param {Array} vendors - Array of vendor objects
   * @param {Object} analysis - Parsed requirement analysis from Gemini
   * @returns {Array} - Sorted vendors with match scores
   */
  rankVendors(vendors, analysis) {
    if (!vendors || vendors.length === 0) return []
    
    const weights = analysis.matchingPriority || this.defaultWeights
    
    const scoredVendors = vendors.map(vendor => {
      const scores = {
        skillScore: this.calculateSkillScore(vendor, analysis),
        availabilityScore: this.calculateAvailabilityScore(vendor, analysis),
        experienceScore: this.calculateExperienceScore(vendor, analysis),
        ratingScore: this.calculateRatingScore(vendor),
        locationScore: this.calculateLocationScore(vendor, analysis)
      }
      
      // Calculate weighted total score
      const totalScore = 
        (scores.skillScore * (weights.skillWeight || weights.skillMatch || 0.35)) +
        (scores.availabilityScore * (weights.availabilityWeight || weights.availability || 0.25)) +
        (scores.experienceScore * (weights.experienceWeight || weights.experience || 0.20)) +
        (scores.ratingScore * (weights.ratingWeight || weights.rating || 0.10)) +
        (scores.locationScore * (weights.locationWeight || weights.location || 0.10))
      
      return {
        ...vendor,
        matchScore: Math.round(totalScore * 100) / 100,
        matchDetails: scores,
        matchPercentage: Math.round(totalScore * 100)
      }
    })
    
    // Sort by match score (highest first)
    return scoredVendors.sort((a, b) => b.matchScore - a.matchScore)
  }

  /**
   * Calculate skill match score (0-1)
   * Prioritizes must_have skills over nice_to_have
   */
  calculateSkillScore(vendor, analysis) {
    if (!vendor.skills || vendor.skills.length === 0) return 0
    
    const vendorSkillNames = vendor.skills.map(s => 
      (typeof s === 'string' ? s : s.name || '').toLowerCase()
    )
    
    let score = 0
    let maxScore = 0
    
    // Must-have skills (weighted 2x)
    const mustHave = analysis.skillPriority?.must_have || analysis.requiredSkills?.slice(0, 2) || []
    mustHave.forEach(skill => {
      maxScore += 2
      const skillLower = skill.toLowerCase()
      if (vendorSkillNames.some(vs => vs.includes(skillLower) || skillLower.includes(vs))) {
        score += 2
      }
    })
    
    // Nice-to-have skills (weighted 1x)
    const niceToHave = analysis.skillPriority?.nice_to_have || analysis.requiredSkills?.slice(2) || []
    niceToHave.forEach(skill => {
      maxScore += 1
      const skillLower = skill.toLowerCase()
      if (vendorSkillNames.some(vs => vs.includes(skillLower) || skillLower.includes(vs))) {
        score += 1
      }
    })
    
    // All required skills (if no priority structure)
    if (mustHave.length === 0 && niceToHave.length === 0 && analysis.requiredSkills) {
      analysis.requiredSkills.forEach(skill => {
        maxScore += 1
        const skillLower = skill.toLowerCase()
        if (vendorSkillNames.some(vs => vs.includes(skillLower) || skillLower.includes(vs))) {
          score += 1
        }
      })
    }
    
    // Bonus for exact matches
    const exactMatches = vendorSkillNames.filter(vs => 
      [...mustHave, ...niceToHave, ...(analysis.requiredSkills || [])].some(
        skill => skill.toLowerCase() === vs
      )
    ).length
    score += exactMatches * 0.5
    maxScore += exactMatches * 0.5
    
    return maxScore > 0 ? Math.min(score / maxScore, 1) : 0
  }

  /**
   * Calculate availability score (0-1)
   * Heavily prioritizes available vendors when urgency is high
   */
  calculateAvailabilityScore(vendor, analysis) {
    const vendorAvailability = vendor.availability || 'within_month'
    const vendorStatus = vendor.availabilityStatus || 'available'
    const requiredAvailability = analysis.availability?.required || 'flexible'
    const urgency = analysis.availability?.urgency || 'medium'
    
    let score = 0
    
    // Availability status scoring
    const statusScores = {
      'available': 1.0,
      'limited': 0.6,
      'busy': 0.3,
      'unavailable': 0.0
    }
    score += statusScores[vendorStatus] || 0.5
    
    // Availability timing match
    const timingOrder = ['immediate', 'within_week', 'within_month', 'custom', 'flexible']
    const vendorIndex = timingOrder.indexOf(vendorAvailability)
    const requiredIndex = timingOrder.indexOf(requiredAvailability)
    
    if (vendorIndex !== -1 && requiredIndex !== -1) {
      if (vendorIndex <= requiredIndex) {
        score += 1.0  // Vendor can meet or exceed requirement
      } else {
        // Penalty based on how far off the timing is
        const diff = vendorIndex - requiredIndex
        score += Math.max(0, 1 - (diff * 0.3))
      }
    } else {
      score += 0.5  // Unknown timing
    }
    
    // Apply urgency multiplier
    const urgencyMultiplier = {
      'high': 1.5,
      'medium': 1.0,
      'low': 0.8
    }
    
    const baseScore = score / 2  // Normalize to 0-1
    const finalScore = baseScore * (urgencyMultiplier[urgency] || 1.0)
    
    return Math.min(finalScore, 1)
  }

  /**
   * Calculate experience score (0-1)
   */
  calculateExperienceScore(vendor, analysis) {
    const requiredExp = analysis.experience?.minYears || 0
    const requiredLevel = analysis.experience?.level || 'intermediate'
    
    let score = 0
    
    // Calculate from vendor skills' years of experience
    if (vendor.skills && vendor.skills.length > 0) {
      const avgYears = vendor.skills.reduce((sum, skill) => {
        return sum + (skill.yearsOfExperience || 0)
      }, 0) / vendor.skills.length
      
      if (requiredExp > 0) {
        if (avgYears >= requiredExp) {
          score += 0.5
        } else {
          score += (avgYears / requiredExp) * 0.5
        }
      } else {
        score += 0.3  // No specific requirement
      }
      
      // Level matching
      const levelScores = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 }
      const requiredLevelScore = { 'beginner': 1, 'intermediate': 2, 'senior': 3, 'expert': 4 }
      
      const vendorMaxLevel = Math.max(...vendor.skills.map(s => levelScores[s.level] || 2))
      const reqLevel = requiredLevelScore[requiredLevel] || 2
      
      if (vendorMaxLevel >= reqLevel) {
        score += 0.5
      } else {
        score += (vendorMaxLevel / reqLevel) * 0.5
      }
    } else {
      score = 0.3  // No skill info
    }
    
    return Math.min(score, 1)
  }

  /**
   * Calculate rating score (0-1)
   */
  calculateRatingScore(vendor) {
    const rating = vendor.rating?.average || vendor.rating || 0
    const totalReviews = vendor.rating?.totalReviews || 0
    
    // Base rating score (0-5 normalized to 0-1)
    let score = rating / 5
    
    // Boost for verified vendors
    if (vendor.isVerified) {
      score += 0.1
    }
    
    // Small boost for having reviews
    if (totalReviews > 0) {
      const reviewBoost = Math.min(totalReviews / 50, 0.1)  // Max 0.1 boost
      score += reviewBoost
    }
    
    return Math.min(score, 1)
  }

  /**
   * Calculate location score (0-1)
   */
  calculateLocationScore(vendor, analysis) {
    const requiredLocation = analysis.location
    if (!requiredLocation) return 0.5  // No location preference
    
    const vendorCity = vendor.location?.city?.toLowerCase() || ''
    const vendorState = vendor.location?.state?.toLowerCase() || ''
    const reqLocation = requiredLocation.toLowerCase()
    
    // Exact city match
    if (vendorCity === reqLocation) return 1.0
    
    // City contains or is contained in requirement
    if (vendorCity.includes(reqLocation) || reqLocation.includes(vendorCity)) return 0.8
    
    // State match
    if (vendorState === reqLocation || vendorState.includes(reqLocation)) return 0.6
    
    // Same country (India)
    if (vendor.location?.country?.toLowerCase() === 'india') return 0.3
    
    return 0.1
  }

  /**
   * Simple relevance scoring for normal search
   * @param {Object} vendor - Vendor object
   * @param {string} query - Search query
   * @param {Array} queryWords - Parsed query words
   * @returns {number} - Relevance score (0-1)
   */
  calculateRelevanceScore(vendor, query, queryWords) {
    if (!query || !queryWords || queryWords.length === 0) return 0
    
    let score = 0
    let maxScore = queryWords.length * 4  // Max 4 points per word
    
    const vendorSkillNames = (vendor.skills || []).map(s => 
      (typeof s === 'string' ? s : s.name || '').toLowerCase()
    )
    const vendorServiceNames = (vendor.services || []).map(s => 
      (typeof s === 'string' ? s : s.name || '').toLowerCase()
    )
    const vendorName = (vendor.name || '').toLowerCase()
    const vendorBio = (vendor.profile?.bio || '').toLowerCase()
    
    queryWords.forEach(word => {
      const wordLower = word.toLowerCase()
      
      // Exact skill match (4 points)
      if (vendorSkillNames.some(s => s === wordLower)) {
        score += 4
      }
      // Partial skill match (3 points)
      else if (vendorSkillNames.some(s => s.includes(wordLower) || wordLower.includes(s))) {
        score += 3
      }
      // Service match (2 points)
      else if (vendorServiceNames.some(s => s.includes(wordLower))) {
        score += 2
      }
      // Name match (1.5 points)
      else if (vendorName.includes(wordLower)) {
        score += 1.5
      }
      // Bio match (1 point)
      else if (vendorBio.includes(wordLower)) {
        score += 1
      }
    })
    
    // Bonus for availability
    if (vendor.availabilityStatus === 'available') {
      score += 0.5
    }
    
    // Bonus for verification
    if (vendor.isVerified) {
      score += 0.3
    }
    
    // Bonus for rating
    const rating = vendor.rating?.average || vendor.rating || 0
    score += (rating / 5) * 0.5
    
    return Math.min(score / maxScore, 1)
  }

  /**
   * Legacy method for backward compatibility
   */
  calculateScore(vendor, query) {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0)
    return this.calculateRelevanceScore(vendor, query, queryWords)
  }

  calculateSkillMatch(vendorSkills, query) {
    if (!vendorSkills || !query) return 0
    
    const queryTerms = query.toLowerCase().split(/\s+/)
    let matches = 0
    
    for (const term of queryTerms) {
      for (const skill of vendorSkills) {
        const skillName = typeof skill === 'string' ? skill : skill.name || ''
        if (skillName.toLowerCase().includes(term) || term.includes(skillName.toLowerCase())) {
          matches++
          break
        }
      }
    }
    
    return Math.min(matches / queryTerms.length, 1)
  }
}

export default new RankingService() 
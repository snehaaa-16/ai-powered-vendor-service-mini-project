import geminiConnection from '../config/gemini.js';
import classificationService from './classificationService.js';

class GeminiSearchService {
  constructor() {
    this.gemini = geminiConnection;
    this.classificationService = classificationService;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      if (this.gemini.isInitialized) {
        this.isInitialized = true;
        console.log('✅ Gemini Search Service initialized');
        return;
      }
      
      // Try to initialize Gemini
      this.gemini.initialize();
      this.isInitialized = this.gemini.isInitialized;
      
      if (this.isInitialized) {
        console.log('✅ Gemini Search Service initialized');
      } else {
        console.log('⚠️ Gemini Search Service not available, using fallback methods');
      }
    } catch (error) {
      console.error('❌ Gemini Search Service initialization failed:', error);
      this.isInitialized = false;
    }
  }

  async analyzeRequirement(requirement) {
    try {
      // Check if Gemini is available
      if (!this.isInitialized || !this.gemini.isInitialized) {
        console.log('⚠️ Gemini not initialized, using fallback analysis');
        return await this.fallbackRequirementAnalysis(requirement);
      }

      const prompt = `You are an expert project requirement analyzer for a freelancer marketplace. Analyze this client requirement and extract precise matching criteria.

Requirement: "${requirement}"

Extract and return ONLY a valid JSON object with this structure:
{
  "requiredSkills": ["primary_skill", "secondary_skill", "tertiary_skill"],
  "skillPriority": {
    "must_have": ["essential_skills_client_explicitly_needs"],
    "nice_to_have": ["additional_relevant_skills"]
  },
  "location": "city_or_region_if_mentioned_or_null",
  "experience": {
    "minYears": 0,
    "level": "beginner/intermediate/senior/expert"
  },
  "budget": {
    "amount": 0,
    "currency": "INR"
  },
  "availability": {
    "required": "immediate/within_week/flexible",
    "urgency": "high/medium/low"
  },
  "projectType": "web_development/mobile_app/design/data/consulting/other",
  "complexity": "simple/medium/complex",
  "timeline": "urgent/standard/flexible",
  "matchingPriority": {
    "skillWeight": 0.35,
    "availabilityWeight": 0.25,
    "experienceWeight": 0.20,
    "ratingWeight": 0.10,
    "locationWeight": 0.10
  }
}

RULES:
1. If the client mentions urgency, "ASAP", "immediately", or tight deadlines, set availability.required to "immediate" and availability.urgency to "high"
2. Extract ALL relevant technical skills mentioned or implied
3. If budget is mentioned (e.g., "50k", "50000"), convert to number in budget.amount
4. For complex projects, increase experienceWeight in matchingPriority
5. Return ONLY the JSON object, no explanations, no markdown`;

      const response = await this.gemini.generateText(prompt);
      
      try {
        // Clean the response to extract JSON
        const cleanedResponse = this.extractJSONFromResponse(response);
        const analysis = JSON.parse(cleanedResponse);
        return this.validateRequirementAnalysis(analysis);
      } catch (parseError) {
        console.log('⚠️ Gemini response parsing failed, using fallback');
        console.log('Raw response:', response);
        return await this.fallbackRequirementAnalysis(requirement);
      }
    } catch (error) {
      console.error('Gemini requirement analysis error:', error);
      console.log('⚠️ Using fallback analysis due to Gemini error');
      return await this.fallbackRequirementAnalysis(requirement);
    }
  }

  async extractIntent(query) {
    try {
      if (!this.isInitialized || !this.gemini.isInitialized) {
        return await this.fallbackIntentExtraction(query);
      }

      const prompt = `Analyze this search query and extract the intent and requirements:
Query: "${query}"

Extract and return in JSON format:
{
  "intent": "brief description of what user wants",
  "requirements": ["skill1", "skill2", "skill3"],
  "budget": {"min": number, "max": number, "currency": "USD"},
  "timeline": "urgency level (low/medium/high)",
  "location": "preferred location if mentioned",
  "experience": "experience level if mentioned"
}

Only return the JSON, no additional text.`;

      const response = await this.gemini.generateText(prompt);
      
      try {
        const intent = JSON.parse(response);
        return this.validateIntent(intent);
      } catch (parseError) {
        return await this.fallbackIntentExtraction(query);
      }
    } catch (error) {
      console.error('Gemini intent extraction error:', error);
      return await this.fallbackIntentExtraction(query);
    }
  }

  async enhanceSearchCriteria(searchCriteria) {
    try {
      if (!this.isInitialized || !this.gemini.isInitialized) {
        return searchCriteria;
      }

      const prompt = `Given these search criteria, enhance them with related skills and requirements:
Current criteria: ${JSON.stringify(searchCriteria)}

Enhance and return in JSON format:
{
  "enhancedSkills": ["additional_skill1", "additional_skill2"],
  "relatedTechnologies": ["tech1", "tech2"],
  "suggestedExperience": "experience_level",
  "projectComplexity": "simple/medium/complex"
}

Only return the JSON, no additional text.`;

      const response = await this.gemini.generateText(prompt);
      
      try {
        const enhancement = JSON.parse(response);
        return this.mergeEnhancement(searchCriteria, enhancement);
      } catch (parseError) {
        return searchCriteria;
      }
    } catch (error) {
      console.error('Gemini enhancement error:', error);
      return searchCriteria;
    }
  }

  async generateSearchSuggestions(query) {
    try {
      if (!this.isInitialized || !this.gemini.isInitialized) {
        return this.generateFallbackSuggestions(query);
      }

      const prompt = `Generate 5 search suggestions for this query: "${query}"
Return as JSON array of strings:
["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]`;

      const response = await this.gemini.generateText(prompt);
      
      try {
        const suggestions = JSON.parse(response);
        return Array.isArray(suggestions) ? suggestions.slice(0, 5) : [];
      } catch (parseError) {
        return this.generateFallbackSuggestions(query);
      }
    } catch (error) {
      console.error('Gemini suggestions error:', error);
      return this.generateFallbackSuggestions(query);
    }
  }

  async classifyAmbiguousToken(token) {
    try {
      if (!this.isInitialized || !this.gemini.isInitialized) {
        return this.classificationService.classifyToken(token);
      }

      const prompt = `Classify this token: "${token}"
Options: skill, location, name, experience, number, unknown
Consider context and return only the classification.`;

      const response = await this.gemini.generateText(prompt);
      const classification = response.trim().toLowerCase();
      
      return {
        type: classification,
        confidence: 0.8,
        value: token,
        source: 'gemini'
      };
    } catch (error) {
      return this.classificationService.classifyToken(token);
    }
  }

  async analyzeVendorMatch(vendor, searchCriteria) {
    try {
      if (!this.isInitialized || !this.gemini.isInitialized) {
        return this.fallbackVendorAnalysis(vendor, searchCriteria);
      }

      const prompt = `Analyze how well this vendor matches the search criteria:

Vendor: ${JSON.stringify({
  name: vendor.name,
  skills: vendor.skills.map(s => s.name),
  location: vendor.location,
  rating: vendor.rating
})}

Search Criteria: ${JSON.stringify(searchCriteria)}

Return analysis in JSON:
{
  "matchScore": 0.85,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendation": "strong_match/good_match/weak_match"
}`;

      const response = await this.gemini.generateText(prompt);
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        return this.fallbackVendorAnalysis(vendor, searchCriteria);
      }
    } catch (error) {
      console.error('Gemini vendor analysis error:', error);
      return this.fallbackVendorAnalysis(vendor, searchCriteria);
    }
  }

  validateRequirementAnalysis(analysis) {
    const defaultAnalysis = {
      requiredSkills: [],
      skillPriority: { must_have: [], nice_to_have: [] },
      location: null,
      experience: { minYears: 0, level: 'intermediate' },
      budget: { amount: 0, currency: 'INR' },
      availability: { required: 'flexible', urgency: 'medium' },
      projectType: 'general',
      complexity: 'medium',
      timeline: 'standard',
      matchingPriority: {
        skillWeight: 0.35,
        availabilityWeight: 0.25,
        experienceWeight: 0.20,
        ratingWeight: 0.10,
        locationWeight: 0.10
      }
    };

    if (!analysis || typeof analysis !== 'object') {
      return defaultAnalysis;
    }

    // Handle backward compatibility for old format
    const experience = typeof analysis.experience === 'object' 
      ? analysis.experience 
      : { minYears: parseInt(analysis.experience) || 0, level: 'intermediate' };

    const budget = typeof analysis.budget === 'object'
      ? analysis.budget
      : { amount: parseInt(analysis.budget) || 0, currency: 'INR' };

    const availability = typeof analysis.availability === 'object'
      ? analysis.availability
      : { required: analysis.availability || 'flexible', urgency: 'medium' };

    return {
      ...defaultAnalysis,
      ...analysis,
      requiredSkills: Array.isArray(analysis.requiredSkills) ? analysis.requiredSkills : [],
      skillPriority: analysis.skillPriority || defaultAnalysis.skillPriority,
      experience,
      budget,
      availability,
      matchingPriority: analysis.matchingPriority || defaultAnalysis.matchingPriority
    };
  }

  validateIntent(intent) {
    const defaultIntent = {
      intent: 'general search',
      requirements: [],
      budget: { min: 0, max: 10000, currency: 'USD' },
      timeline: 'medium',
      location: null,
      experience: null
    };

    if (!intent || typeof intent !== 'object') {
      return defaultIntent;
    }

    return {
      ...defaultIntent,
      ...intent,
      requirements: Array.isArray(intent.requirements) ? intent.requirements : [],
      budget: {
        ...defaultIntent.budget,
        ...(intent.budget || {})
      }
    };
  }

  async fallbackRequirementAnalysis(requirement) {
    try {
      const classification = await this.classificationService.classifyQuery(requirement);
      
      // Extract budget from the requirement text
      let budgetAmount = 0;
      const budgetMatch = requirement.match(/(\d+)k/i);
      if (budgetMatch) {
        budgetAmount = parseInt(budgetMatch[1]) * 1000;
      } else {
        const budgetMatch2 = requirement.match(/budget.*?(\d+)k/i);
        if (budgetMatch2) {
          budgetAmount = parseInt(budgetMatch2[1]) * 1000;
        } else {
          const budgetMatch3 = requirement.match(/budget\s+is\s+(\d+)k/i);
          if (budgetMatch3) {
            budgetAmount = parseInt(budgetMatch3[1]) * 1000;
          } else {
            // Check for plain numbers
            const plainNumber = requirement.match(/(\d{4,})/);
            if (plainNumber) {
              budgetAmount = parseInt(plainNumber[1]);
            }
          }
        }
      }
      
      const lowerReq = requirement.toLowerCase();
      
      // Determine project type based on keywords
      let projectType = 'general';
      if (lowerReq.includes('website') || lowerReq.includes('web') || lowerReq.includes('e-commerce')) {
        projectType = 'web_development';
      } else if (lowerReq.includes('mobile') || lowerReq.includes('app')) {
        projectType = 'mobile_app';
      } else if (lowerReq.includes('design') || lowerReq.includes('ui') || lowerReq.includes('ux')) {
        projectType = 'design';
      } else if (lowerReq.includes('data') || lowerReq.includes('analytics') || lowerReq.includes('ml')) {
        projectType = 'data';
      }
      
      // Determine complexity
      let complexity = 'medium';
      if (lowerReq.includes('e-commerce') || lowerReq.includes('payment') || lowerReq.includes('integration') || lowerReq.includes('enterprise')) {
        complexity = 'complex';
      } else if (lowerReq.includes('simple') || lowerReq.includes('basic') || lowerReq.includes('small')) {
        complexity = 'simple';
      }
      
      // Determine timeline urgency
      let timeline = 'standard';
      let availabilityUrgency = 'medium';
      if (lowerReq.includes('urgent') || lowerReq.includes('asap') || lowerReq.includes('immediately') || lowerReq.includes('rush')) {
        timeline = 'urgent';
        availabilityUrgency = 'high';
      } else if (lowerReq.includes('flexible') || lowerReq.includes('no rush') || lowerReq.includes('whenever')) {
        timeline = 'flexible';
        availabilityUrgency = 'low';
      }
      
      // Determine availability requirement
      let availabilityRequired = 'flexible';
      if (lowerReq.includes('immediate') || lowerReq.includes('urgent') || lowerReq.includes('asap') || lowerReq.includes('now')) {
        availabilityRequired = 'immediate';
      } else if (lowerReq.includes('this week') || lowerReq.includes('soon')) {
        availabilityRequired = 'within_week';
      }
      
      // Extract experience level
      let expYears = classification.numbers.length > 0 ? parseInt(classification.numbers[0].value) : 0;
      let expLevel = 'intermediate';
      if (lowerReq.includes('senior') || lowerReq.includes('expert') || expYears >= 5) {
        expLevel = 'senior';
      } else if (lowerReq.includes('junior') || lowerReq.includes('beginner') || expYears <= 1) {
        expLevel = 'beginner';
      } else if (lowerReq.includes('expert') || lowerReq.includes('specialist') || expYears >= 8) {
        expLevel = 'expert';
      }
      
      const skills = classification.skills.map(s => s.value);
      
      // Adjust weights based on requirement context
      const matchingPriority = {
        skillWeight: 0.35,
        availabilityWeight: availabilityUrgency === 'high' ? 0.30 : 0.25,
        experienceWeight: complexity === 'complex' ? 0.25 : 0.20,
        ratingWeight: 0.10,
        locationWeight: classification.locations.length > 0 ? 0.15 : 0.10
      };
      
      return {
        requiredSkills: skills,
        skillPriority: {
          must_have: skills.slice(0, 2),
          nice_to_have: skills.slice(2)
        },
        location: classification.locations.length > 0 ? classification.locations[0].value : null,
        experience: { minYears: expYears, level: expLevel },
        budget: { amount: budgetAmount, currency: 'INR' },
        availability: { required: availabilityRequired, urgency: availabilityUrgency },
        projectType: projectType,
        complexity: complexity,
        timeline: timeline,
        matchingPriority: matchingPriority
      };
    } catch (error) {
      console.error('Fallback requirement analysis error:', error);
      return {
        requiredSkills: [],
        skillPriority: { must_have: [], nice_to_have: [] },
        location: null,
        experience: { minYears: 0, level: 'intermediate' },
        budget: { amount: 0, currency: 'INR' },
        availability: { required: 'flexible', urgency: 'medium' },
        projectType: 'general',
        complexity: 'medium',
        timeline: 'standard',
        matchingPriority: {
          skillWeight: 0.35,
          availabilityWeight: 0.25,
          experienceWeight: 0.20,
          ratingWeight: 0.10,
          locationWeight: 0.10
        }
      };
    }
  }

  async fallbackIntentExtraction(query) {
    try {
      const classification = await this.classificationService.classifyQuery(query);
      
      return {
        intent: 'search based on keywords',
        requirements: classification.skills.map(s => s.value),
        budget: { min: 0, max: 10000, currency: 'USD' },
        timeline: 'medium',
        location: classification.locations.length > 0 ? classification.locations[0].value : null,
        experience: classification.experience.length > 0 ? classification.experience[0].value : null
      };
    } catch (error) {
      console.error('Fallback intent extraction error:', error);
      return {
        intent: 'search based on keywords',
        requirements: [],
        budget: { min: 0, max: 10000, currency: 'USD' },
        timeline: 'medium',
        location: null,
        experience: null
      };
    }
  }

  mergeEnhancement(searchCriteria, enhancement) {
    return {
      ...searchCriteria,
      skills: [
        ...searchCriteria.skills,
        ...(enhancement.enhancedSkills || []).map(skill => ({ value: skill, confidence: 0.7 }))
      ],
      relatedTechnologies: enhancement.relatedTechnologies || [],
      suggestedExperience: enhancement.suggestedExperience || searchCriteria.experience,
      projectComplexity: enhancement.projectComplexity || 'medium'
    };
  }

  generateFallbackSuggestions(query) {
    const tokens = query.split(' ');
    const suggestions = [];
    
    if (tokens.length > 1) {
      suggestions.push(tokens.slice(0, -1).join(' '));
      suggestions.push(tokens.slice(1).join(' '));
    }
    
    suggestions.push(query + ' developer');
    suggestions.push(query + ' expert');
    suggestions.push(query + ' specialist');
    
    return suggestions.slice(0, 5);
  }

  fallbackVendorAnalysis(vendor, searchCriteria) {
    const skillMatch = vendor.skills.filter(skill => 
      searchCriteria.skills.some(s => s.value.toLowerCase() === skill.name.toLowerCase())
    ).length;
    
    const matchScore = skillMatch / Math.max(searchCriteria.skills.length, 1);
    
    return {
      matchScore: Math.min(matchScore, 1),
      strengths: vendor.skills.map(s => s.name),
      weaknesses: [],
      recommendation: matchScore > 0.7 ? 'strong_match' : matchScore > 0.4 ? 'good_match' : 'weak_match'
    };
  }

  extractJSONFromResponse(response) {
    try {
      // Try to find JSON object in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return jsonMatch[0];
      }
      
      // If no JSON object found, try to clean the response
      let cleaned = response.trim();
      
      // Remove markdown code blocks
      cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Remove any text before the first {
      const startIndex = cleaned.indexOf('{');
      if (startIndex > 0) {
        cleaned = cleaned.substring(startIndex);
      }
      
      // Remove any text after the last }
      const endIndex = cleaned.lastIndexOf('}');
      if (endIndex > 0 && endIndex < cleaned.length - 1) {
        cleaned = cleaned.substring(0, endIndex + 1);
      }
      
      return cleaned;
    } catch (error) {
      console.error('JSON extraction error:', error);
      return response;
    }
  }

  getStatus() {
    return {
      isAvailable: this.isInitialized && this.gemini.isInitialized,
      model: 'gemini-2.5-flash'
    };
  }
}

const geminiSearchService = new GeminiSearchService();

export default geminiSearchService; 
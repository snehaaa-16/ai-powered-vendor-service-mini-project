import dictionaryManager from '../utils/dictionaries.js';
import Tokenizer from '../utils/tokenizer.js';
import locationService from './locationService.js';

class ClassificationService {
  constructor() {
    this.dictionaryManager = dictionaryManager;
    this.locationService = locationService;
  }

  async classifyToken(token) {
    const normalizedToken = Tokenizer.normalizeToken(token);
    const lowerToken = token.toLowerCase();
    
    // Check for skills (case-insensitive)
    if (this.dictionaryManager.isSkill(lowerToken)) {
      return { type: 'skill', confidence: 0.9, value: lowerToken };
    }
    
    // Check for experience keywords
    if (this.dictionaryManager.isExperienceKeyword(lowerToken)) {
      return { type: 'experience', confidence: 0.8, value: lowerToken };
    }
    
    // Check for numbers (including "50k" -> "50000")
    if (/^\d+$/.test(normalizedToken)) {
      return { type: 'number', confidence: 0.7, value: normalizedToken };
    }
    
    // Check for budget patterns like "50k", "100k"
    if (/^\d+k$/i.test(token)) {
      const number = parseInt(token.replace(/k/i, '')) * 1000;
      return { type: 'number', confidence: 0.8, value: number.toString() };
    }
    
    // Check for months/years patterns
    if (/^\d+\s*(months?|years?|yrs?)$/i.test(token)) {
      const number = parseInt(token.match(/\d+/)[0]);
      return { type: 'number', confidence: 0.8, value: number.toString() };
    }
    
    // Check for names (capitalized words)
    if (/^[A-Z]/.test(token) && normalizedToken.length > 2) {
      return { type: 'name', confidence: 0.6, value: normalizedToken };
    }
    
    return { type: 'unknown', confidence: 0.1, value: normalizedToken };
  }

  async classifyLocation(token) {
    try {
      // First check our local dictionary
      if (this.dictionaryManager.isLocation(token.toLowerCase())) {
        return { 
          type: 'location', 
          confidence: 0.9, 
          value: token.toLowerCase(),
          details: this.dictionaryManager.getLocationDetails(token)
        };
      }
      
      // Fallback to external API
      const results = await this.locationService.searchLocation(token);
      if (results.length > 0) {
        return { 
          type: 'location', 
          confidence: 0.8, 
          value: token,
          details: results[0]
        };
      }
      return null;
    } catch (error) {
      console.error('Location classification error:', error);
      return null;
    }
  }

  async classifyQuery(query) {
    const tokens = Tokenizer.tokenize(query);
    const classifications = [];
    
    for (const token of tokens) {
      const classification = await this.classifyToken(token);
      classifications.push({
        token,
        ...classification
      });
      
      const locationClassification = await this.classifyLocation(token);
      if (locationClassification) {
        classifications.push({
          token,
          ...locationClassification
        });
      }
    }
    
    return this.aggregateClassifications(classifications);
  }

  aggregateClassifications(classifications) {
    const aggregated = {
      skills: [],
      locations: [],
      experience: [],
      numbers: [],
      names: [],
      unknown: []
    };
    
    classifications.forEach(classification => {
      if (classification && classification.confidence > 0.5 && classification.type) {
        const key = classification.type + 's';
        if (aggregated[key] && Array.isArray(aggregated[key])) {
          aggregated[key].push({
            value: classification.value,
            confidence: classification.confidence
          });
        }
      }
    });
    
    return aggregated;
  }

  async classifyWithGemini(token, geminiService) {
    try {
      const prompt = `Classify this word: "${token}"
Options: skill, location, name, experience, number, unknown
Return only the classification.`;
      
      const response = await geminiService.generateText(prompt);
      const classification = response.trim().toLowerCase();
      
      return {
        type: classification,
        confidence: 0.8,
        value: token,
        source: 'gemini'
      };
    } catch (error) {
      return this.classifyToken(token);
    }
  }

  getSkillCategory(skill) {
    return this.dictionaryManager.getSkillCategory(skill);
  }

  getLocationDetails(location) {
    return this.dictionaryManager.getLocationDetails(location);
  }

  validateClassification(classification) {
    const validTypes = ['skill', 'location', 'name', 'experience', 'number', 'unknown'];
    
    if (!validTypes.includes(classification.type)) {
      throw new Error(`Invalid classification type: ${classification.type}`);
    }
    
    if (classification.confidence < 0 || classification.confidence > 1) {
      throw new Error(`Invalid confidence value: ${classification.confidence}`);
    }
    
    return true;
  }
}

const classificationService = new ClassificationService();

export default classificationService; 
import skillsData from '../data/skills.json' assert { type: 'json' };
import locationsData from '../data/locations.json' assert { type: 'json' };

class DictionaryManager {
  constructor() {
    this.skillsSet = new Set();
    this.locationsSet = new Set();
    this.experienceKeywords = new Set([
      'years', 'year', 'yrs', 'experience', 'exp', 'senior', 'junior', 
      'expert', 'beginner', 'intermediate', 'fresher', 'experienced'
    ]);
    
    this.initializeDictionaries();
  }

  initializeDictionaries() {
    Object.values(skillsData).forEach(category => {
      category.forEach(skill => {
        this.skillsSet.add(skill.toLowerCase());
      });
    });

    Object.values(locationsData).forEach(country => {
      Object.values(country).forEach(states => {
        states.forEach(city => {
          this.locationsSet.add(city.toLowerCase());
        });
      });
    });
  }

  isSkill(token) {
    return this.skillsSet.has(token.toLowerCase());
  }

  isLocation(token) {
    return this.locationsSet.has(token.toLowerCase());
  }

  isExperienceKeyword(token) {
    return this.experienceKeywords.has(token.toLowerCase());
  }

  getSkillCategory(skill) {
    const normalizedSkill = skill.toLowerCase();
    
    for (const [category, skills] of Object.entries(skillsData)) {
      if (skills.some(s => s.toLowerCase() === normalizedSkill)) {
        return category;
      }
    }
    
    return null;
  }

  getLocationDetails(location) {
    const normalizedLocation = location.toLowerCase();
    
    for (const [country, states] of Object.entries(locationsData)) {
      for (const [state, cities] of Object.entries(states)) {
        if (cities.some(city => city.toLowerCase() === normalizedLocation)) {
          return { country, state, city: location };
        }
      }
    }
    
    return null;
  }

  getAllSkills() {
    return Array.from(this.skillsSet);
  }

  getAllLocations() {
    return Array.from(this.locationsSet);
  }

  searchSkills(query) {
    const normalizedQuery = query.toLowerCase();
    return Array.from(this.skillsSet).filter(skill => 
      skill.includes(normalizedQuery)
    );
  }

  searchLocations(query) {
    const normalizedQuery = query.toLowerCase();
    return Array.from(this.locationsSet).filter(location => 
      location.includes(normalizedQuery)
    );
  }
}

const dictionaryManager = new DictionaryManager();

export default dictionaryManager; 
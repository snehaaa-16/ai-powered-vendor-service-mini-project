class Tokenizer {
  static tokenize(query) {
    if (!query || typeof query !== 'string') {
      return [];
    }

    const tokens = query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0)
      .map(token => token.trim());

    return [...new Set(tokens)];
  }

  static extractNumbers(query) {
    const numberRegex = /\d+/g;
    return query.match(numberRegex) || [];
  }

  static extractSpecialTerms(query) {
    const specialTerms = [];
    
    const experiencePatterns = [
      /(\d+)\s*(?:years?|yrs?)/gi,
      /(senior|junior|expert|beginner|intermediate)/gi,
      /(experience|exp)/gi
    ];

    experiencePatterns.forEach(pattern => {
      const matches = query.match(pattern);
      if (matches) {
        specialTerms.push(...matches);
      }
    });

    return specialTerms;
  }

  static normalizeToken(token) {
    return token
      .toLowerCase()
      .replace(/[^\w]/g, '')
      .trim();
  }

  static getTokenType(token) {
    const normalized = this.normalizeToken(token);
    
    if (/^\d+$/.test(normalized)) {
      return 'number';
    }
    
    if (normalized.length <= 2) {
      return 'short';
    }
    
    return 'word';
  }
}

export default Tokenizer; 
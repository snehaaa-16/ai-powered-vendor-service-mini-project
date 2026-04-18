class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.vendorIds = new Set();
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, vendorId) {
    let node = this.root;
    const normalizedWord = word.toLowerCase();
    
    for (const char of normalizedWord) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    
    node.isEndOfWord = true;
    node.vendorIds.add(vendorId);
  }

  search(prefix) {
    const normalizedPrefix = prefix.toLowerCase();
    let node = this.root;
    
    for (const char of normalizedPrefix) {
      if (!node.children.has(char)) {
        return new Set();
      }
      node = node.children.get(char);
    }
    
    return this.getAllVendorIds(node);
  }

  getAllVendorIds(node) {
    const vendorIds = new Set();
    
    if (node.isEndOfWord) {
      node.vendorIds.forEach(id => vendorIds.add(id));
    }
    
    for (const child of node.children.values()) {
      const childIds = this.getAllVendorIds(child);
      childIds.forEach(id => vendorIds.add(id));
    }
    
    return vendorIds;
  }

  delete(word, vendorId) {
    this.deleteHelper(this.root, word.toLowerCase(), 0, vendorId);
  }

  deleteHelper(node, word, index, vendorId) {
    if (index === word.length) {
      if (node.isEndOfWord) {
        node.vendorIds.delete(vendorId);
        if (node.vendorIds.size === 0) {
          node.isEndOfWord = false;
        }
      }
      return node.children.size === 0 && !node.isEndOfWord;
    }

    const char = word[index];
    if (!node.children.has(char)) {
      return false;
    }

    const shouldDeleteChild = this.deleteHelper(node.children.get(char), word, index + 1, vendorId);
    
    if (shouldDeleteChild) {
      node.children.delete(char);
      return node.children.size === 0 && !node.isEndOfWord;
    }
    
    return false;
  }
}

class TrieService {
  constructor() {
    this.nameTrie = new Trie();
    this.skillsTrie = new Trie();
    this.locationTrie = new Trie();
    this.experienceTrie = new Trie();
    this.isInitialized = false;
  }

  async initialize(vendors) {
    if (this.isInitialized) {
      return;
    }

    for (const vendor of vendors) {
      this.insertVendor(vendor);
    }

    this.isInitialized = true;
  }

  insertVendor(vendor) {
    if (!vendor || !vendor._id) {
      return;
    }

    const vendorId = String(vendor._id);

    // Name
    if (typeof vendor.name === 'string' && vendor.name.trim()) {
      this.nameTrie.insert(vendor.name, vendorId);
    }

    // Skills
    if (Array.isArray(vendor.skills)) {
      vendor.skills.forEach((skill) => {
        if (!skill) return;
        if (typeof skill.name === 'string' && skill.name.trim()) {
          this.skillsTrie.insert(skill.name, vendorId);
        }
        if (Number.isFinite(skill?.yearsOfExperience)) {
          this.experienceTrie.insert(String(skill.yearsOfExperience), vendorId);
        }
        if (typeof skill.level === 'string' && skill.level.trim()) {
          this.experienceTrie.insert(skill.level, vendorId);
        }
      });
    }

    // Location
    const loc = vendor.location || {};
    if (typeof loc.city === 'string' && loc.city.trim()) {
      this.locationTrie.insert(loc.city, vendorId);
    }
    if (typeof loc.state === 'string' && loc.state.trim()) {
      this.locationTrie.insert(loc.state, vendorId);
    }
    if (typeof loc.country === 'string' && loc.country.trim()) {
      this.locationTrie.insert(loc.country, vendorId);
    }
  }

  deleteVendor(vendor) {
    if (!vendor || !vendor._id) {
      return;
    }

    const vendorId = String(vendor._id);

    if (typeof vendor.name === 'string' && vendor.name.trim()) {
      this.nameTrie.delete(vendor.name, vendorId);
    }

    if (Array.isArray(vendor.skills)) {
      vendor.skills.forEach((skill) => {
        if (!skill) return;
        if (typeof skill.name === 'string' && skill.name.trim()) {
          this.skillsTrie.delete(skill.name, vendorId);
        }
        if (Number.isFinite(skill?.yearsOfExperience)) {
          this.experienceTrie.delete(String(skill.yearsOfExperience), vendorId);
        }
        if (typeof skill.level === 'string' && skill.level.trim()) {
          this.experienceTrie.delete(skill.level, vendorId);
        }
      });
    }

    const loc = vendor.location || {};
    if (typeof loc.city === 'string' && loc.city.trim()) {
      this.locationTrie.delete(loc.city, vendorId);
    }
    if (typeof loc.state === 'string' && loc.state.trim()) {
      this.locationTrie.delete(loc.state, vendorId);
    }
    if (typeof loc.country === 'string' && loc.country.trim()) {
      this.locationTrie.delete(loc.country, vendorId);
    }
  }

  search(query) {
    const normalizedQuery = query.toLowerCase();
    const results = {
      name: this.nameTrie.search(normalizedQuery),
      skills: this.skillsTrie.search(normalizedQuery),
      location: this.locationTrie.search(normalizedQuery),
      experience: this.experienceTrie.search(normalizedQuery)
    };

    return results;
  }

  searchAll(query) {
    const results = this.search(query);
    const allVendorIds = new Set();
    
    Object.values(results).forEach(vendorIds => {
      vendorIds.forEach(id => allVendorIds.add(id));
    });
    
    return Array.from(allVendorIds);
  }

  getSearchStats() {
    return {
      isInitialized: this.isInitialized,
      nameTrieSize: this.getTrieSize(this.nameTrie.root),
      skillsTrieSize: this.getTrieSize(this.skillsTrie.root),
      locationTrieSize: this.getTrieSize(this.locationTrie.root),
      experienceTrieSize: this.getTrieSize(this.experienceTrie.root)
    };
  }

  getTrieSize(node) {
    let size = 1;
    for (const child of node.children.values()) {
      size += this.getTrieSize(child);
    }
    return size;
  }

  async getSuggestions(query) {
    if (!this.isInitialized) {
      return [];
    }

    const normalizedQuery = query.toLowerCase();
    const suggestions = new Set();

    // Get suggestions from skills trie
    const skillResults = this.skillsTrie.search(normalizedQuery);
    if (skillResults.size > 0) {
      // Add the query itself as a suggestion if it matches skills
      suggestions.add(query);
    }

    // Get suggestions from location trie
    const locationResults = this.locationTrie.search(normalizedQuery);
    if (locationResults.size > 0) {
      suggestions.add(query);
    }

    // Add common skill suggestions if query is short
    if (query.length < 3) {
      const commonSkills = [
        'React', 'Node.js', 'JavaScript', 'Python', 'Java', 'PHP', 'Angular', 'Vue.js',
        'MongoDB', 'MySQL', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'DevOps',
        'UI/UX', 'Design', 'Mobile', 'iOS', 'Android', 'Flutter', 'React Native'
      ];
      
      commonSkills.forEach(skill => {
        if (skill.toLowerCase().includes(normalizedQuery)) {
          suggestions.add(skill);
        }
      });
    }

    return Array.from(suggestions).slice(0, 10);
  }
}

const trieService = new TrieService();

export default trieService; 
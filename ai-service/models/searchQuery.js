import mongoose from 'mongoose';

const aiProcessedQuerySchema = new mongoose.Schema({
  intent: {
    type: String,
    required: true
  },
  requirements: [String],
  budget: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  timeline: String,
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});

const searchQuerySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false
  },
  query: {
    type: String,
    required: true,
    index: true
  },
  aiProcessedQuery: {
    type: String,
    required: false
  },
  searchResults: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }],
  selectedVendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  searchTimestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  sessionId: {
    type: String,
    required: false, // Made optional
    default: 'system',
    index: true
  },
  searchType: {
    type: String,
    enum: ['skill', 'advanced', 'smart', 'regular', 'ai'],
    required: false,
    default: 'skill'
  },
  processingTime: {
    type: Number,
    default: 0
  },
  resultCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

searchQuerySchema.index({ searchTimestamp: -1 });
searchQuerySchema.index({ searchType: 1, searchTimestamp: -1 });

const SearchQuery = mongoose.model('SearchQuery', searchQuerySchema);

export default SearchQuery; 
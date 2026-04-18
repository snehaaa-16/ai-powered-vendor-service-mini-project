import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import VendorCard from '../components/VendorCard.jsx'
import Section from '../sections/Section.jsx'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showAISearch, setShowAISearch] = useState(false)
  const [aiRequirement, setAiRequirement] = useState('')
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    experience: 0,
    budget: 100000,
    rating: 0,
    availability: 'any',
    vendorType: 'any',
    verified: false
  })

  // Load initial search if query exists
  useEffect(() => {
    if (searchParams.get('q') || searchParams.get('skill') || searchParams.get('service')) {
      const query = searchParams.get('q') || searchParams.get('skill') || searchParams.get('service')
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query = searchQuery) => {
    if (!query.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await api.get(`/skill-search?q=${encodeURIComponent(query)}`)
      if (result.success && result.vendors) {
        setVendors(result.vendors)
      } else {
        setVendors([])
        setError('No results found')
      }
    } catch (err) {
      setError(err.message || 'Search failed')
      setVendors([])
    } finally {
      setLoading(false)
    }
  }

  const performAdvancedSearch = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const searchFilters = {
        skills: filters.skills.split(',').map(s => s.trim()).filter(Boolean),
        location: filters.location ? { city: filters.location } : null,
        rating: filters.rating > 0 ? filters.rating : null,
        availability: filters.availability === 'any' ? null : filters.availability,
        priceRange: filters.budget > 0 ? { min: 0, max: filters.budget } : null
      }
      
      // Remove null values
      Object.keys(searchFilters).forEach(key => {
        if (searchFilters[key] === null) {
          delete searchFilters[key]
        }
      })
      
      const result = await api.post('/advanced-filter', searchFilters)
      if (result.success && result.vendors) {
        setVendors(result.vendors)
      } else {
        setVendors([])
        setError('No results found')
      }
    } catch (err) {
      setError(err.message || 'Advanced search failed')
      setVendors([])
    } finally {
      setLoading(false)
    }
  }

  const performAISearch = async () => {
    if (!aiRequirement.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await api.post('/smart-search', { requirement: aiRequirement })
      if (result.success && result.vendors) {
        setVendors(result.vendors)
        setShowAISearch(false)
      } else {
        setVendors([])
        setError('No results found')
      }
    } catch (err) {
      setError(err.message || 'AI search failed')
      setVendors([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch()
  }

  const clearFilters = () => {
    setFilters({
      skills: '',
      location: '',
      experience: 0,
      budget: 100000,
      rating: 0,
      availability: 'any',
      vendorType: 'any',
      verified: false
    })
    setVendors([])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Main Search Bar */}
            <div className="flex-1 w-full lg:w-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for skills, services, or vendors..."
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-r-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-6 py-4 font-semibold rounded-xl border-2 transition-all duration-200 ${
                  showAdvancedFilters
                    ? 'border-purple-600 bg-purple-600 text-white'
                    : 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
                }`}
              >
                {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
              </button>
              
              <button
                onClick={() => setShowAISearch(!showAISearch)}
                className={`px-6 py-4 font-semibold rounded-xl border-2 transition-all duration-200 ${
                  showAISearch
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                🤖 AI Search
              </button>
            </div>
          </div>

          {/* AI Search Panel */}
          {showAISearch && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🤖 AI-Powered Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Describe your project requirements in natural language and let AI find the perfect vendors.
              </p>
              <div className="flex gap-3">
                <textarea
                  value={aiRequirement}
                  onChange={(e) => setAiRequirement(e.target.value)}
                  placeholder="e.g., I need a React developer to build an e-commerce website with payment integration. Budget is 50k and I need it completed in 2 months. Prefer someone in Mumbai with 3+ years experience."
                  rows={3}
                  className="flex-1 p-4 border-2 border-blue-200 dark:border-blue-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors resize-none"
                />
                <button
                  onClick={performAISearch}
                  disabled={!aiRequirement.trim() || loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 self-end"
                >
                  {loading ? 'Analyzing...' : 'Analyze & Search'}
                </button>
              </div>
            </div>
          )}

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-6 p-6 bg-white dark:bg-slate-700 rounded-2xl border border-gray-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  🔍 Advanced Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills
                  </label>
                  <input
                    type="text"
                    value={filters.skills}
                    onChange={(e) => setFilters({...filters, skills: e.target.value})}
                    placeholder="React, Node.js"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    placeholder="Mumbai, Bangalore"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Experience (years)
                  </label>
                  <input
                    type="number"
                    value={filters.experience}
                    onChange={(e) => setFilters({...filters, experience: parseInt(e.target.value) || 0})}
                    min="0"
                    max="20"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={filters.budget}
                    onChange={(e) => setFilters({...filters, budget: parseInt(e.target.value) || 0})}
                    min="0"
                    step="1000"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Rating
                  </label>
                  <input
                    type="number"
                    value={filters.rating}
                    onChange={(e) => setFilters({...filters, rating: parseFloat(e.target.value) || 0})}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({...filters, availability: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="any">Any</option>
                    <option value="immediate">Immediate</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vendor Type
                  </label>
                  <select
                    value={filters.vendorType}
                    onChange={(e) => setFilters({...filters, vendorType: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="any">Any</option>
                                    <option value="individual">Individual</option>
                <option value="agency">Agency</option>
                <option value="startup">Startup</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) => setFilters({...filters, verified: e.target.checked})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Verified Only</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={performAdvancedSearch}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? 'Searching...' : 'Apply Filters & Search'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h2>
            {vendors.length > 0 && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Found {vendors.length} vendor{vendors.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          {vendors.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing results for "{searchQuery || 'advanced search'}"
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <div className="text-red-600 dark:text-red-400 font-medium mb-2">Search Error</div>
            <div className="text-red-500 dark:text-red-300">{error}</div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && vendors.length === 0 && searchQuery && (
          <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No vendors found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or use AI search for better results.
            </p>
            <button
              onClick={() => setShowAISearch(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Try AI Search
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && vendors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor, index) => (
              <VendorCard key={vendor._id || index} vendor={vendor} />
            ))}
          </div>
        )}

        {/* Initial State */}
        {!loading && !error && vendors.length === 0 && !searchQuery && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ready to find your perfect tech partner?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by searching for skills, services, or use AI search to describe your project requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowAISearch(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                🤖 Try AI Search
              </button>
              <button
                onClick={() => setShowAdvancedFilters(true)}
                className="px-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-semibold rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-200"
              >
                🔍 Advanced Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { api } from '../lib/api.js'
import Section from './Section.jsx'

export default function SkillSearch() {
  const [q, setQ] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const onSearch = async () => {
    if (!q.trim()) return
    
    setLoading(true)
    setError(null)
    setPage(1)
    
    try {
      const result = await api.get(`/skill-search?q=${encodeURIComponent(q.trim())}&page=1&limit=${limit}`)
      
      if (result.success) {
        setData(result)
      } else {
        setError(result.error || 'Search failed')
      }
    } catch (e) {
      setError(e.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (!data || page >= data.pagination.pages) return
    
    setLoading(true)
    try {
      const nextPage = page + 1
      const result = await api.get(`/skill-search?q=${encodeURIComponent(q.trim())}&page=${nextPage}&limit=${limit}`)
      
      if (result.success) {
        setData({
          ...result,
          vendors: [...data.vendors, ...result.vendors]
        })
        setPage(nextPage)
      }
    } catch (e) {
      setError(e.message || 'Failed to load more results')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQ(suggestion)
    setSuggestions([])
    onSearch()
  }

  useEffect(() => {
    if (q.length < 2) {
      setSuggestions([])
      return
    }

    const t = setTimeout(async () => {
      try {
        setSuggestLoading(true)
        const result = await api.get(`/suggest?q=${encodeURIComponent(q)}&limit=8`)
        
        if (result.success) {
          setSuggestions(result.suggestions || [])
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        setSuggestions([])
      } finally {
        setSuggestLoading(false)
      }
    }, 300)

    return () => clearTimeout(t)
  }, [q])

  return (
    <Section title="Search by Skills">
      <div className="space-y-4">
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              placeholder="Search for skills like 'web developer', 'react', 'mongodb'..."
              className="w-full p-4 pr-12 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors"
            />
            <button
              onClick={onSearch}
              disabled={loading || !q.trim()}
              className="absolute right-2 top-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {suggestLoading && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg text-center text-gray-500 dark:text-gray-400">
              Loading suggestions...
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search Results
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Found {data.pagination.total} vendors
              </span>
            </div>

            {data.vendors.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">🔍</div>
                <p>No vendors found for "{data.query}"</p>
                <p className="text-sm mt-2">Try different keywords or check spelling</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.vendors.map((vendor) => (
                  <div key={vendor._id} className="p-4 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {vendor.name}
                          </h4>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {vendor.vendorType}
                          </span>
                          {vendor.isVerified && (
                            <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs">Verified</span>
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {vendor.rating || 'N/A'}
                            </span>
                          </div>
                          
                          {vendor.reviews && vendor.reviews.count > 0 && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {vendor.reviews.count} reviews
                            </span>
                          )}
                        </div>

                        {vendor.profile?.bio && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {vendor.profile.bio}
                          </p>
                        )}

                        {vendor.skills && vendor.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {vendor.skills.slice(0, 5).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg"
                              >
                                {skill}
                              </span>
                            ))}
                            {vendor.skills.length > 5 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg">
                                +{vendor.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}

                        {vendor.location && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>
                              {vendor.location.city}, {vendor.location.state}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {data.pagination.pages > 1 && page < data.pagination.pages && (
                  <div className="text-center pt-4">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Loading...' : 'Load More Results'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  )
}



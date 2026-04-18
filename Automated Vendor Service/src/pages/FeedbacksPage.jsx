import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { api } from '../lib/api.js'

export default function FeedbacksPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [conversations, setConversations] = useState([])
  const [ratings, setRatings] = useState({}) // vendorId -> selected rating
  const [submitting, setSubmitting] = useState({}) // vendorId -> bool
  const [messages, setMessages] = useState({}) // vendorId -> { error?, success? }
  const [ratedVendors, setRatedVendors] = useState({}) // vendorId -> true once rated

  useEffect(() => {
    (async () => {
      if (!user || user.role !== 'client') {
        setLoading(false)
        return
      }
      setLoading(true)
      setError('')
      try {
        const res = await api.get('/chat-history/client')
        if (res.success) {
          setConversations(res.conversations || [])
        } else {
          setError(res.error || 'Failed to load feedback data')
        }
      } catch (e) {
        setError(e.message || 'Failed to load feedback data')
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  const vendors = useMemo(() => {
    const map = new Map()
    for (const c of conversations) {
      if (c.vendor && c.vendor._id && !map.has(c.vendor._id)) {
        map.set(c.vendor._id, c.vendor)
      }
    }
    return Array.from(map.values())
  }, [conversations])

  const handleRate = async (vendorId, value) => {
    setRatings(prev => ({ ...prev, [vendorId]: value }))
    setMessages(prev => ({ ...prev, [vendorId]: { error: '', success: '' } }))
    setSubmitting(prev => ({ ...prev, [vendorId]: true }))
    try {
      await api.post(`/vendors/${vendorId}/rating`, { rating: value })
      setMessages(prev => ({
        ...prev,
        [vendorId]: { ...prev[vendorId], success: 'Thanks! Your rating has been recorded.' },
      }))
      // Mark vendor as rated so it disappears from the list
      setRatedVendors(prev => ({ ...prev, [vendorId]: true }))
    } catch (e) {
      setMessages(prev => ({
        ...prev,
        [vendorId]: { ...prev[vendorId], error: e.message || 'Failed to submit rating' },
      }))
    } finally {
      setSubmitting(prev => ({ ...prev, [vendorId]: false }))
    }
  }

  if (!user || user.role !== 'client') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Feedbacks are available only for client accounts.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-6">
      <div className="max-w-5xl mx-auto px-4 lg:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feedbacks</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Rate vendors you have chatted with. Your feedback helps improve rankings and future matches.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && vendors.filter(v => !ratedVendors[v._id]).length === 0 && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">⭐</div>
            <p className="text-gray-800 dark:text-gray-100 font-semibold mb-1">
              No vendors to rate yet
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start a conversation with a vendor and you’ll see them listed here for feedback.
            </p>
          </div>
        )}

        {!loading && !error && vendors.filter(v => !ratedVendors[v._id]).length > 0 && (
          <div className="space-y-3">
            {vendors.filter(v => !ratedVendors[v._id]).map((v) => {
              const vendorId = v._id
              const currentRating = ratings[vendorId] || 0
              const msg = messages[vendorId] || {}
              const isSubmitting = submitting[vendorId]
              const location = v.location
                ? `${v.location.city}, ${v.location.state}`
                : 'Location not specified'

              return (
                <div
                  key={vendorId}
                  className="flex items-center justify-between bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {v.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {location}
                    </div>
                    {msg.error && (
                      <div className="mt-1 text-[11px] text-red-500">{msg.error}</div>
                    )}
                    {msg.success && (
                      <div className="mt-1 text-[11px] text-green-600 dark:text-green-400">
                        {msg.success}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleRate(vendorId, value)}
                          disabled={isSubmitting}
                          className="text-2xl focus:outline-none"
                        >
                          <span
                            className={
                              value <= currentRating
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-slate-700'
                            }
                          >
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                    {currentRating > 0 && (
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">
                        {currentRating}/5
                      </div>
                    )}
                    {isSubmitting && (
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">
                        Saving...
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}



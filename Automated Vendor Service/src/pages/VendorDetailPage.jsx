import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import ChatWidget from '../components/ChatWidget.jsx'

export default function VendorDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      setLoading(true)
      setError(null)
      try {
        // Prefer vendor passed via navigation state to avoid a failing fetch due to mismatched ids
        const stateVendor = location.state?.vendor
        if (stateVendor) {
          setVendor(stateVendor)
        } else {
          const res = await api.get(`/vendor/${id}`)
          setVendor(res.data?.vendor || res.data || null)
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [id, location.state])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading vendor profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!vendor) {
    return <div>Vendor not found</div>
  }

  const averageRating = vendor.rating?.average || 0
  const totalReviews = vendor.rating?.totalReviews || 0
  const locationText = vendor.location ? `${vendor.location.city}, ${vendor.location.state}` : 'Location not specified'
  const availabilityStatus = vendor.availabilityStatus || 'available'
  const availabilityColor =
    availabilityStatus === 'available'
      ? 'text-emerald-400 bg-emerald-500/10'
      : 'text-amber-400 bg-amber-500/10'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-6">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        {/* Hero header */}
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-[1px] shadow-xl">
          <div className="bg-slate-950/90 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-2xl">
                  {vendor.name?.[0] || 'V'}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{vendor.name}</h1>
                  <p className="text-sm text-slate-300 mt-1">{locationText}</p>
                </div>
              </div>
              {vendor.profile?.bio && (
                <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl">
                  {vendor.profile.bio}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-3 text-xs md:text-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-100">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-slate-400">
                    ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                  </span>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${availabilityColor}`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span className="capitalize">{availabilityStatus}</span>
                </div>
                {vendor.vendorType && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-100">
                    <span>{vendor.vendorType === 'Company' ? '🏢' : '👤'}</span>
                    <span className="capitalize text-xs md:text-sm">{vendor.vendorType}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-stretch md:items-end gap-3">
              <button
                onClick={() => navigate(`/chatbot?vendorId=${id}`)}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                Open Full Chat
              </button>
              <p className="text-xs text-slate-400">
                Response time: {vendor.responseTime || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: profile details */}
          <div className="md:col-span-2 space-y-6">
            {/* Skills */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Skills
              </h2>
              {(!vendor.skills || vendor.skills.length === 0) && (
                <p className="text-sm text-slate-500">No skills added yet.</p>
              )}
              {vendor.skills && vendor.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {vendor.skills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 text-xs text-purple-700 dark:text-purple-200"
                    >
                      <span>{s.name}</span>
                      {typeof s.yearsOfExperience === 'number' && (
                        <span className="text-[11px] text-purple-500/80">
                          {s.yearsOfExperience}y
                        </span>
                      )}
                      {s.level && (
                        <span className="text-[11px] text-purple-500/80">
                          · {s.level}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Services */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Services
              </h2>
              {(!vendor.services || vendor.services.length === 0) && (
                <p className="text-sm text-slate-500">No services listed yet.</p>
              )}
              <div className="space-y-3">
                {(vendor.services || []).map((svc, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {svc.name}
                      </p>
                      {svc.description && (
                        <p className="text-xs md:text-sm text-slate-500 mt-1 line-clamp-2">
                          {svc.description}
                        </p>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-purple-600 dark:text-purple-300">
                      ₹{(svc.minPrice ?? 0).toLocaleString()} - ₹
                      {(svc.maxPrice ?? 0).toLocaleString()}{' '}
                      {svc.currency || 'INR'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: stats + inline chat */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Rating
                </p>
                <p className="flex items-center gap-2 text-sm text-slate-100">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Availability
                </p>
                <p className="text-sm text-slate-900 dark:text-slate-100 capitalize">
                  {availabilityStatus}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Typical response time
                </p>
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  {vendor.responseTime || 'Not specified'}
                </p>
              </div>
            </div>

            <ChatWidget vendorId={id} />
          </div>
        </div>
      </div>
    </div>
  )
}



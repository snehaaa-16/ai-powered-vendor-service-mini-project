import React from 'react'
import { Link } from 'react-router-dom'

export default function VendorCard({ vendor }) {
  const v = vendor
  
  // Calculate average rating
  const averageRating = v.rating?.average || 0
  const totalReviews = v.rating?.totalReviews || 0
  
  // Format skills display
  const displaySkills = (v.skills || []).slice(0, 4)
  const hasMoreSkills = (v.skills || []).length > 4
  
  // Format location
  const location = v.location ? `${v.location.city}, ${v.location.state}` : 'Location not specified'
  
  // Format vendor type with icon
  const vendorTypeIcon = v.vendorType === 'Company' ? '🏢' : '👤'
  
  // Format availability status
  const availabilityStatus = v.availabilityStatus || 'Unknown'
  const availabilityColor = v.availabilityStatus === 'available' ? 'text-green-600' : 'text-red-600'
  
  // Format response time
  const responseTime = v.availability?.responseTime || 'Not specified'

  const vendorId = (typeof v._id === 'string') ? v._id : (v._id && v._id.$oid) ? v._id.$oid : (v.id || '')

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link 
            to={`/vendor/${vendorId}`} 
            state={{ vendor: v }}
            className="text-xl font-bold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2"
          >
            {v.name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm">{vendorTypeIcon}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
          {v.vendorType === 'individual' ? 'Individual' : 
           v.vendorType === 'agency' ? 'Agency' : 
           v.vendorType === 'startup' ? 'Startup' : 
           v.vendorType || 'Individual'}
        </span>
            {v.isVerified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
        
        {/* Rating */}
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Bio */}
      {v.profile?.bio && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {v.profile.bio}
        </p>
      )}

      {/* Skills */}
      {displaySkills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {displaySkills.map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full border border-purple-200 dark:border-purple-700"
              >
                {skill.name || skill}
              </span>
            ))}
            {hasMoreSkills && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                +{(v.skills || []).length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Location & Availability */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <span>📍</span>
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className={`flex items-center gap-1 font-medium ${availabilityColor}`}>
          <span>●</span>
          <span>{availabilityStatus}</span>
        </div>
      </div>

      {/* Services Preview */}
      {v.services && v.services.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Services
          </div>
          <div className="space-y-2">
            {v.services.slice(0, 2).map((service, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-medium line-clamp-1">
                  {service.name}
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                  ₹{service.minPrice?.toLocaleString() || '0'} - ₹{service.maxPrice?.toLocaleString() || '0'} {service.currency || 'INR'}
                </span>
              </div>
            ))}
            {v.services.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                +{v.services.length - 2} more services
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span>Response: {responseTime}</span>
        </div>
        
        <Link 
          to={`/vendor/${vendorId}`}
          state={{ vendor: v }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
        >
          View Profile
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

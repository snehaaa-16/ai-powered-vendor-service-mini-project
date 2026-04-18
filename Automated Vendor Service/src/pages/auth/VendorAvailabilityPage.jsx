import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VendorAvailabilityPage() {
  const [availability, setAvailability] = useState({
    availableForProjects: true,
    availabilityNotes: '',
    responseTime: '2-4 hours',
    workingHours: '9 AM - 6 PM IST',
    timeZone: 'IST (UTC+5:30)',
    communicationPreferences: {
      email: true,
      phone: true,
      whatsapp: true,
      videoCall: true
    }
  })
  
  const navigate = useNavigate()

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setAvailability(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setAvailability(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSaveAndContinue = () => {
    // Validate required fields
    if (!availability.workingHours.trim()) {
      alert('Please enter your working hours.')
      return
    }
    
    // Save availability to localStorage
    localStorage.setItem('vendorAvailability', JSON.stringify(availability))
    // Navigate to preview page
    navigate('/register/new-vendor/preview')
  }

  const handleGoBack = () => {
    navigate('/register/new-vendor/step4')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 border border-dashed border-white/20">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Set Your Availability</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            {/* Business Availability */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <label className="text-white font-medium">Business Availability</label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="availableForProjects"
                  checked={availability.availableForProjects}
                  onChange={(e) => handleInputChange('availableForProjects', e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                />
                <label htmlFor="availableForProjects" className="text-white">Available for new projects</label>
              </div>
              
              <input
                type="text"
                value={availability.availabilityNotes}
                onChange={(e) => handleInputChange('availabilityNotes', e.target.value)}
                placeholder="Additional notes about your availability..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Response Time */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                                 <label className="text-white font-medium">Response Time *</label>
              </div>
              <select
                value={availability.responseTime}
                onChange={(e) => handleInputChange('responseTime', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="1-2 hours">1-2 hours</option>
                <option value="2-4 hours">2-4 hours</option>
                <option value="4-8 hours">4-8 hours</option>
                <option value="24 hours">24 hours</option>
                <option value="2-3 days">2-3 days</option>
              </select>
            </div>

            {/* Working Hours */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                                 <label className="text-white font-medium">Working Hours *</label>
              </div>
              <input
                type="text"
                value={availability.workingHours}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
                placeholder="9 AM - 6 PM IST"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Time Zone */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                                 <label className="text-white font-medium">Time Zone *</label>
              </div>
              <select
                value={availability.timeZone}
                onChange={(e) => handleInputChange('timeZone', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                <option value="EST (UTC-5)">EST (UTC-5)</option>
                <option value="PST (UTC-8)">PST (UTC-8)</option>
                <option value="GMT (UTC+0)">GMT (UTC+0)</option>
                <option value="CET (UTC+1)">CET (UTC+1)</option>
                <option value="JST (UTC+9)">JST (UTC+9)</option>
              </select>
            </div>

            {/* Communication Preferences */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <label className="text-white font-medium">Communication Preferences</label>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="email"
                    checked={availability.communicationPreferences.email}
                    onChange={(e) => handleInputChange('communicationPreferences.email', e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="email" className="text-white">Email</label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="phone"
                    checked={availability.communicationPreferences.phone}
                    onChange={(e) => handleInputChange('communicationPreferences.phone', e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="phone" className="text-white">Phone</label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="whatsapp"
                    checked={availability.communicationPreferences.whatsapp}
                    onChange={(e) => handleInputChange('communicationPreferences.whatsapp', e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="whatsapp" className="text-white">WhatsApp</label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="videoCall"
                    checked={availability.communicationPreferences.videoCall}
                    onChange={(e) => handleInputChange('communicationPreferences.videoCall', e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="videoCall" className="text-white">Video Call</label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleGoBack}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={handleSaveAndContinue}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Complete Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

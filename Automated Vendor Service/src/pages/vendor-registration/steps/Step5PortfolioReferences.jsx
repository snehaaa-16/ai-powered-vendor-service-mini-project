import React from 'react'

const Step5PortfolioReferences = ({ formData, handleInputChange }) => {
  const toggleCommPref = (key) => {
    const current = formData.step5.communicationPreferences || {}
    handleInputChange('step5', 'communicationPreferences', {
      ...current,
      [key]: !current[key]
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Set Your Availability
      </h2>

      {/* Business Availability */}
      <div className="space-y-2">
        <div className="flex items-center mb-1">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
          </svg>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Business Availability</h3>
        </div>
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800">
          <select
            value={formData.step5.availabilityStatus || 'available'}
            onChange={(e) => handleInputChange('step5', 'availabilityStatus', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="available">Available for new projects</option>
            <option value="busy">Currently busy</option>
            <option value="limited">Limited availability</option>
            <option value="unavailable">Not available</option>
          </select>
        </div>
      </div>

      {/* Response Time */}
      <div className="space-y-2">
        <div className="flex items-center mb-1">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8.414V6a1 1 0 10-2 0v5a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414L11 10.414z"/>
          </svg>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Response Time</h3>
        </div>
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800">
          <select
            value={formData.step5.responseTime || '2-4 hours'}
            onChange={(e) => handleInputChange('step5', 'responseTime', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="1-2 hours">1-2 hours</option>
            <option value="2-4 hours">2-4 hours</option>
            <option value="4-8 hours">4-8 hours</option>
            <option value="within 24 hours">Within 24 hours</option>
          </select>
        </div>
      </div>

      {/* Working Hours */}
      <div className="space-y-2">
        <div className="flex items-center mb-1">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM2 9v6a2 2 0 002 2h12a2 2 0 002-2V9H2z"/>
          </svg>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Working Hours</h3>
        </div>
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800">
          <input
            type="text"
            value={formData.step5.workingHours || '9 AM - 6 PM IST'}
            onChange={(e) => handleInputChange('step5', 'workingHours', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
            placeholder="9 AM - 6 PM IST"
          />
        </div>
      </div>

      {/* Time Zone */}
      <div className="space-y-2">
        <div className="flex items-center mb-1">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8.414V6a1 1 0 10-2 0v5a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414L11 10.414z"/>
          </svg>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Time Zone</h3>
        </div>
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800">
          <select
            value={formData.step5.timeZone || 'IST (UTC+5:30)'}
            onChange={(e) => handleInputChange('step5', 'timeZone', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
            <option value="EST (UTC-5)">EST (UTC-5)</option>
            <option value="PST (UTC-8)">PST (UTC-8)</option>
            <option value="GMT (UTC+0)">GMT (UTC+0)</option>
            <option value="CET (UTC+1)">CET (UTC+1)</option>
            <option value="JST (UTC+9)">JST (UTC+9)</option>
          </select>
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="space-y-2">
        <div className="flex items-center mb-1">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-3l-3 3-3-3H4a2 2 0 01-2-2V5z"/>
          </svg>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Communication Preferences</h3>
        </div>
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800">
          <div className="space-y-2">
            {['email','phone','whatsapp','videoCall'].map((key) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(formData.step5.communicationPreferences || {})[key] || false}
                  onChange={() => toggleCommPref(key)}
                  className="mr-3 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-900 dark:text-white capitalize">
                  {key === 'videoCall' ? 'Video Call' : key}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Registration */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={() => {
            console.log('Registration completed with availability:', formData.step5)
            alert('Registration completed! Check console for data.')
          }}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
        >
          Complete Registration
        </button>
      </div>
    </div>
  )
}

export default Step5PortfolioReferences

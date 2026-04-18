import React from 'react'

const Step3ServicesPricing = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Add Your Services
      </h2>
      
      {/* Services & Pricing Section */}
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Services & Pricing</h3>
        </div>

        {/* Existing Services List */}
        <div className="space-y-3">
          {/* Service 1: Web Development */}
          <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 relative">
            <div className="absolute right-4 top-4 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
            <div className="pr-8">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Service 1: Web Development
                </h4>
                <button
                  onClick={() => {
                    const updatedServices = formData.step3.services.filter((_, i) => i !== 0)
                    handleInputChange('step3', 'services', updatedServices)
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  [Remove]
                </button>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Description:</strong> Custom web applications...</p>
                <p><strong>Price:</strong> ₹25,000 - ₹150,000</p>
                <p><strong>Duration:</strong> 2-8 weeks</p>
              </div>
            </div>
          </div>

          {/* Service 2: API Development */}
          <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 relative">
            <div className="absolute right-4 top-4 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
            <div className="pr-8">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Service 2: API Development
                </h4>
                <button
                  onClick={() => {
                    const updatedServices = formData.step3.services.filter((_, i) => i !== 1)
                    handleInputChange('step3', 'services', updatedServices)
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  [Remove]
                </button>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Description:</strong> RESTful and GraphQL APIs</p>
                <p><strong>Price:</strong> ₹15,000 - ₹80,000</p>
                <p><strong>Duration:</strong> 1-4 weeks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Another Service Button */}
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 relative">
          <div className="absolute right-4 top-4 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
          <div className="pr-8">
            <button
              onClick={() => {
                const newService = {
                  name: '',
                  description: '',
                  minPrice: '',
                  maxPrice: '',
                  currency: 'INR',
                  duration: ''
                }
                const updatedServices = [...(formData.step3.services || []), newService]
                handleInputChange('step3', 'services', updatedServices)
              }}
              className="w-full text-center py-3 text-purple-600 hover:text-purple-700 font-medium border-2 border-dashed border-purple-300 hover:border-purple-400 rounded-lg transition-colors"
            >
              + Add Another Service
            </button>
          </div>
        </div>

        {/* Add New Service Form */}
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-6 bg-white dark:bg-slate-800">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
            </svg>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Add New Service</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Name */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Name:
                </label>
                <input
                  type="text"
                  value={formData.step3.newServiceName || 'Mobile App Development'}
                  onChange={(e) => handleInputChange('step3', 'newServiceName', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Mobile App Development"
                />
              </div>
            </div>

            {/* Description */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description:
                </label>
                <input
                  type="text"
                  value={formData.step3.newServiceDescription || 'Cross-platform mobile apps...'}
                  onChange={(e) => handleInputChange('step3', 'newServiceDescription', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Cross-platform mobile apps..."
                />
              </div>
            </div>

            {/* Min Price */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Price:
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.step3.newServiceMinPrice || '50000'}
                  onChange={(e) => handleInputChange('step3', 'newServiceMinPrice', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="₹50,000"
                />
              </div>
            </div>

            {/* Max Price */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Price:
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.step3.newServiceMaxPrice || '300000'}
                  onChange={(e) => handleInputChange('step3', 'newServiceMaxPrice', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="₹300,000"
                />
              </div>
            </div>

            {/* Currency */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency:
                </label>
                <select
                  value={formData.step3.newServiceCurrency || 'INR'}
                  onChange={(e) => handleInputChange('step3', 'newServiceCurrency', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="INR">INR ▼</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration:
                </label>
                <input
                  type="text"
                  value={formData.step3.newServiceDuration || '4-12 weeks'}
                  onChange={(e) => handleInputChange('step3', 'newServiceDuration', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="4-12 weeks"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save & Continue Button */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={() => {
            // Handle form submission for this step
            console.log('Step 3 completed:', formData.step3)
            // You can add validation here if needed
          }}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
        >
          Save & Continue
        </button>
      </div>
    </div>
  )
}

export default Step3ServicesPricing

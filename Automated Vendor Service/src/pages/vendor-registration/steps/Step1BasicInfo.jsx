import React from 'react'

const Step1BasicInfo = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Step 1: Basic Information
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Tell us about yourself and your business
      </p>
      
      {/* Vendor Type Selection */}
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vendor Type</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Individual */}
          <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 relative">
            <div className="absolute right-4 top-4 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
            <div className="pr-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="vendorType"
                  value="individual"
                  checked={formData.step1.vendorType === 'individual'}
                  onChange={(e) => handleInputChange('step1', 'vendorType', e.target.value)}
                  className="mr-3 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Individual</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Freelancer or solo professional</div>
                </div>
              </label>
            </div>
          </div>

          {/* Agency */}
          <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 relative">
            <div className="absolute right-4 top-4 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
            <div className="pr-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="vendorType"
                  value="agency"
                  checked={formData.step1.vendorType === 'agency'}
                  onChange={(e) => handleInputChange('step1', 'vendorType', e.target.value)}
                  className="mr-3 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Agency</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Company or team</div>
                </div>
              </label>
            </div>
          </div>

          {/* Startup */}
          <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 relative">
            <div className="absolute right-4 top-4 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
            <div className="pr-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="vendorType"
                  value="startup"
                  checked={formData.step1.vendorType === 'startup'}
                  onChange={(e) => handleInputChange('step1', 'vendorType', e.target.value)}
                  className="mr-3 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Startup</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">New business venture</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
            <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
            <div className="pr-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name:
              </label>
              <input
                type="text"
                value={formData.step1.name || ''}
                onChange={(e) => handleInputChange('step1', 'name', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
            <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
            <div className="pr-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email:
              </label>
              <input
                type="email"
                value={formData.step1.email || ''}
                onChange={(e) => handleInputChange('step1', 'email', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
            <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
            <div className="pr-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone:
              </label>
              <input
                type="tel"
                value={formData.step1.phone || ''}
                onChange={(e) => handleInputChange('step1', 'phone', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
            <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
            <div className="pr-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password:
              </label>
              <input
                type="password"
                value={formData.step1.password || ''}
                onChange={(e) => handleInputChange('step1', 'password', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                placeholder="Create a strong password"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
            <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
            <div className="pr-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password:
              </label>
              <input
                type="password"
                value={formData.step1.confirmPassword || ''}
                onChange={(e) => handleInputChange('step1', 'confirmPassword', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Picture */}
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Picture (Optional)</h3>
        </div>

        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 relative">
          <div className="absolute right-4 top-4 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
          <div className="pr-6">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      handleInputChange('step1', 'profilePicture', file)
                    }
                  }}
                />
              </label>
            </div>
            {formData.step1.profilePicture && (
              <div className="mt-4 text-center">
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✓ File selected: {formData.step1.profilePicture.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step1BasicInfo

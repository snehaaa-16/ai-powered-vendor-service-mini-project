import React from 'react'

const Step4LocationAvailability = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Add Your Projects
      </h2>
      
      {/* Portfolio Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio Projects</h3>
        </div>

        {/* Existing Project */}
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 relative">
          <div className="absolute right-4 top-4 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
          <div className="pr-8">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Project 1: E-commerce Platform
              </h4>
              <button
                onClick={() => {
                  // Handle project removal
                  console.log('Remove project')
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                [Remove]
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Description:</strong> Full-stack e-commerce solution</p>
              <p><strong>URL:</strong> https://project.com</p>
              <p><strong>Technologies:</strong> React, Node.js, MongoDB</p>
            </div>
          </div>
        </div>

        {/* Add Another Project Button */}
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 relative">
          <div className="absolute right-4 top-4 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
          <div className="pr-8">
            <button
              onClick={() => {
                // Handle adding another project
                console.log('Add another project')
              }}
              className="w-full text-center py-3 text-purple-600 hover:text-purple-700 font-medium border-2 border-dashed border-purple-300 hover:border-purple-400 rounded-lg transition-colors"
            >
              + Add Another Project
            </button>
          </div>
        </div>

        {/* Add New Project Form */}
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-6 bg-white dark:bg-slate-800">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
            </svg>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Add New Project</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Title */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Title:
                </label>
                <input
                  type="text"
                  value={formData.step4.newProjectTitle || 'Banking App'}
                  onChange={(e) => handleInputChange('step4', 'newProjectTitle', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Banking App"
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
                  value={formData.step4.newProjectDescription || 'Modern banking interface...'}
                  onChange={(e) => handleInputChange('step4', 'newProjectDescription', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Modern banking interface..."
                />
              </div>
            </div>

            {/* Project URL */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project URL:
                </label>
                <input
                  type="url"
                  value={formData.step4.newProjectUrl || 'https://banking-app.com'}
                  onChange={(e) => handleInputChange('step4', 'newProjectUrl', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="https://banking-app.com"
                />
              </div>
            </div>

            {/* Technologies */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technologies:
                </label>
                <input
                  type="text"
                  value={formData.step4.newProjectTechnologies || 'React, TypeScript, Node.js'}
                  onChange={(e) => handleInputChange('step4', 'newProjectTechnologies', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
            </div>

            {/* Project Images */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative md:col-span-2">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Images:
                </label>
                <input
                  type="text"
                  value={formData.step4.newProjectImages || 'Upload Files'}
                  onChange={(e) => handleInputChange('step4', 'newProjectImages', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Upload Files"
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
            console.log('Step 4 completed:', formData.step4)
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

export default Step4LocationAvailability

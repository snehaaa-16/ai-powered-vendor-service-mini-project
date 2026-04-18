import React from 'react'

const VendorRegistrationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="text-center space-y-6">
            <div className="text-6xl">🚧</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Vendor Registration Coming Soon
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our comprehensive 5-step vendor registration process is currently under development. We're building something amazing for you!
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-700 rounded-xl p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stay tuned for updates. We'll notify you when vendor registration is available.
              </p>
            </div>
            
            <div className="space-y-4">
              <a 
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorRegistrationPage

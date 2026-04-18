import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState(null)
  const navigate = useNavigate()

  const handleRoleSelection = (role) => {
    setSelectedRole(role)
    if (role === 'user') {
      navigate('/register/new-user')
    } else if (role === 'vendor') {
      navigate('/register/new-vendor')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Join Our Community
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choose how you want to register
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelection('user')}
              className="w-full p-6 border-2 border-gray-200 dark:border-slate-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">👥</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    Register as User
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Find and hire vendors for your projects
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelection('vendor')}
              className="w-full p-6 border-2 border-gray-200 dark:border-slate-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">💼</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Register as Vendor
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Offer your services and find clients
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



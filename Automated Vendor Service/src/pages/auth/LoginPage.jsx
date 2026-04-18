import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAuthToken } from '../../lib/api.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { showToast } from '../../utils/toast.js'

export default function LoginPage() {
  const [role, setRole] = useState('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { updateUserState } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const res = await api.post('/auth/login', { role, email, password })
      
      if (res.success && res.token) {
        setAuthToken(res.token)
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(res.user))
        
        // Show success toast
        showToast('Login Successful', `Welcome back, ${res.user.name}!`, 'success')
        
        // Update the user state in the app context
        await updateUserState()
          navigate('/') 
      } else {
        setError('Login failed - invalid response')
      }
    } catch (e) {
      // Handle specific role mismatch error
      if (e.message && e.message.includes('registered as a')) {
        setError(e.message)
      } else if (e.message === 'Access denied') {
        setError('Invalid credentials. Please check your email and password.')
      } else {
        setError(e.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'client'
                    ? 'border-purple-600 bg-purple-600 text-white shadow-lg'
                    : 'border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="font-semibold">Client</div>
                <div className="text-xs opacity-90">Find vendors</div>
              </button>
              
              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'vendor'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                    : 'border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-2">💼</div>
                <div className="font-semibold">Vendor</div>
                <div className="text-xs opacity-90">Offer services</div>
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <a href="/register" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                Sign up
              </a>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Demo Credentials (for testing):
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <div>Client: client@demo.com / password123</div>
              <div>Vendor: vendor@demo.com / password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



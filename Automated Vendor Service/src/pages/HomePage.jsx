import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function HomePage() {
  const { user } = useAuth()
  const [trendingServices, setTrendingServices] = useState([])
  const [popularSkills, setPopularSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - you can replace with actual API calls
    setTrendingServices([
      { id: 1, name: 'Web Development', icon: '🌐', count: 245, growth: '+12%' },
      { id: 2, name: 'Mobile App Development', icon: '📱', count: 189, growth: '+18%' },
      { id: 3, name: 'UI/UX Design', icon: '🎨', count: 156, growth: '+15%' },
      { id: 4, name: 'DevOps & Cloud', icon: '☁️', count: 134, growth: '+22%' },
      { id: 5, name: 'AI/ML Development', icon: '🤖', count: 98, growth: '+28%' },
      { id: 6, name: 'Blockchain Development', icon: '⛓️', count: 67, growth: '+35%' }
    ])

    setPopularSkills([
      'React', 'Node.js', 'Python', 'Flutter', 'AWS', 'Docker', 'Figma', 'MongoDB'
    ])
    setLoading(false)
  }, [])

  // Vendor Profile Component
  const VendorProfile = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Profile Header */}
          <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 border border-dashed border-white/20 mb-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white font-bold">
                {user?.name?.charAt(0) || 'V'}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{user?.name || 'Vendor Name'}</h1>
              <p className="text-slate-400 mb-4">{user?.vendorType || 'Individual'} • {user?.location?.city || 'Location'}</p>
              <div className="flex justify-center space-x-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">Available for Projects</span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Verified</span>
              </div>
            </div>
          </div>

          {/* Public Profile Info (Visible to Clients) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-dashed border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Public Profile
              </h3>
              <div className="space-y-3 text-sm">
                <div><span className="text-slate-400">Name:</span> <span className="text-white">{user?.name}</span></div>
                <div><span className="text-slate-400">Type:</span> <span className="text-white">{user?.vendorType}</span></div>
                <div><span className="text-slate-400">Location:</span> <span className="text-white">{user?.location?.city}, {user?.location?.state}</span></div>
                <div><span className="text-slate-400">Email:</span> <span className="text-white">{user?.email}</span></div>
                <div><span className="text-slate-400">Phone:</span> <span className="text-white">{user?.phone}</span></div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-dashed border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">0</div>
                  <div className="text-slate-400 text-sm">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">0</div>
                  <div className="text-slate-400 text-sm">Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">100%</div>
                  <div className="text-slate-400 text-sm">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">24h</div>
                  <div className="text-slate-400 text-sm">Response Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Note for Vendors */}
          <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-400 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Profile Visibility</h4>
                <p className="text-slate-300">
                  This is your public profile that clients will see when searching for vendors. 
                  Additional details like skills, services, and projects are stored but not visible to clients yet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // Show different content based on user role
  if (user && user.role === 'vendor') {
    return <VendorProfile />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Find the Perfect
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Tech Partner
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with verified developers, designers, and tech experts for your next project. 
              AI-powered matching for the perfect fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/search" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                🔍 Start Searching
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              {/* Only show "Join as Vendor" for non-logged-in users or vendors, not for clients */}
              {(!user || user.role === 'vendor') && (
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-8 py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-semibold rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-200"
                >
                  🚀 Join as Vendor
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trending Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Most in-demand technical services this month
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingServices.map((service) => (
              <div 
                key={service.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{service.icon}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                    {service.growth}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.count} active vendors
                </p>
                <Link 
                  to={`/search?service=${service.name}`}
                  className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Find Vendors
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Skills
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Top technical skills in high demand
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {popularSkills.map((skill, index) => (
              <Link
                key={index}
                to={`/search?skill=${skill}`}
                className="group px-6 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-700 rounded-full text-purple-700 dark:text-purple-300 font-medium hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-800/50 dark:hover:to-blue-800/50 hover:border-purple-300 dark:hover:border-purple-600 transform hover:scale-105 transition-all duration-200"
              >
                {skill}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">2,500+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Vendors</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600 dark:text-gray-400">Projects Completed</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-400">Client Satisfaction</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}



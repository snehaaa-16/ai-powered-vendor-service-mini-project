import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.jsx'
import './App.css'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })
  
  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }
  
  return (
    <button 
      onClick={toggle} 
      className="p-2 rounded-xl border border-gray-200 dark:border-slate-600 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

function App() {
  const location = useLocation()
  const { user, loading, handleLogout } = useAuth()

  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  const isHomePage = location.pathname === '/'
  const isSearchPage = location.pathname === '/search'

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <header className="border-b border-gray-200 dark:border-slate-700 sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="text-2xl">🚀</div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Hyperlocal Marketplace
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              {user && user.role === 'vendor' ? (
                // Vendor Navigation
                <>
                  <NavLink 
                    to="/" 
                    className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Profile
                  </NavLink>
                  
                  <NavLink 
                    to="/chats" 
                    className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Chats
                  </NavLink>

                  <NavLink 
                    to="/chatbot" 
                    className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    My Mini Chat Bot
                  </NavLink>
                </>
              ) : (
                // Client Navigation
                <>
                  <NavLink 
                    to="/" 
                    className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Home
                  </NavLink>
                  
                  <NavLink 
                    to="/search" 
                    className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Search
                  </NavLink>

                  <NavLink 
                    to="/chats" 
                    className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    My Vendors
                  </NavLink>

                  <NavLink 
                    to="/feedbacks" 
                    className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Feedbacks
                  </NavLink>
                </>
              )}
            </nav>
            
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome, <span className="font-medium text-gray-900 dark:text-white">{user.name}</span> <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-700">{user.role === 'vendor' ? 'Vendor' : 'Client'}</span>
                  </div>
                  {/* Notification Bell */}
                  <div className="relative">
                    <Link to="/chats" className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center" title="Notifications">
                      🔔
                    </Link>
                    {/* Badge placeholder; wire actual count when backend list endpoint exists */}
                    {/* <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">3</span> */}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <main className={isHomePage ? '' : 'py-8'}>
        <Outlet />
      </main>
    </div>
  )
}

export default App

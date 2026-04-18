import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, clearAuth } from '../lib/api.js'
import { showToast } from '../utils/toast.js'

// Create authentication context
const AuthContext = createContext()

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Function to update user state (can be passed to child components)
  const updateUserState = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to load user:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    // Load and validate user
    updateUserState().finally(() => {
      setLoading(false)
    })
  }, [])

  // Listen for storage changes (when login/logout happens in other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        updateUserState()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    // Show logout toast
    showToast('Logged Out', 'You have been successfully logged out.', 'info')
    
    clearAuth()
    setUser(null)
    window.location.href = '/'
  }

  // Create auth context value
  const authValue = {
    user,
    updateUserState,
    loading,
    handleLogout
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}

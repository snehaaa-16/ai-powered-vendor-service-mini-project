import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { showToast } from '../utils/toast.js'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth()

  // Show loading while checking authentication
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

  // Redirect to login if not authenticated
  if (!user) {
    // Show toast notification for authentication required
    useEffect(() => {
      showToast('Authentication Required', 'Please log in to access this page.', 'info')
    }, [])
    
    return <Navigate to="/login" replace />
  }

  // Check role requirement if specified
  if (requiredRole && user.role !== requiredRole) {
    // Show toast notification for access denied
    useEffect(() => {
      showToast('Access Denied', `You don't have permission to access this page. Only ${requiredRole}s can access this area.`, 'error')
    }, [])
    
    // Redirect to home page
    return <Navigate to="/" replace />
  }

  return children
}

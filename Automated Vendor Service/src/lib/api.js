export const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api'

export function getAuthToken() {
  return localStorage.getItem('token') || ''
}

export function setAuthToken(token) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Validate current token and get user info
export async function validateToken() {
  const token = getAuthToken()
  if (!token) return null
  
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
        return data.user
      }
    }
    
    // Token is invalid, clear it
    clearAuth()
    return null
  } catch (error) {
    console.error('Token validation failed:', error)
    clearAuth()
    return null
  }
}

// Get current user from localStorage or validate token
export async function getCurrentUser() {
  const savedUser = localStorage.getItem('user')
  
  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser)
      return parsedUser
    } catch (e) {
      console.error('Failed to parse saved user:', e)
      localStorage.removeItem('user')
    }
  }
  
  // Try to validate token and get fresh user data
  const validatedUser = await validateToken()
  return validatedUser
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getAuthToken()
  
  // Validate API_BASE is configured
  if (!API_BASE) {
    throw new Error('API_BASE_URL is not configured')
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    })
    
    if (!res.ok) {
      let message = 'Request failed'
      let errorData = null
      
      try { 
        errorData = await res.json()
        message = errorData?.error || errorData?.message || message 
      } catch {
        // If JSON parsing fails, use status text
        message = res.statusText || message
      }
      
      // Handle specific HTTP status codes
      if (res.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.')
      } else if (res.status === 404) {
        throw new Error('Resource not found')
      } else if (res.status === 401) {
        // Clear invalid token
        clearAuth()
        throw new Error('Authentication required')
      } else if (res.status === 403) {
        // For role mismatch, preserve the specific message from backend
        throw new Error(errorData?.message || 'Access denied')
      } else {
        throw new Error(message)
      }
    }
    
    return res.json()
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.')
    }
    throw error
  }
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}



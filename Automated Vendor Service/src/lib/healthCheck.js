import { api } from './api.js'

export async function checkServiceHealth() {
  try {
    const health = await api.get('/health')
    return {
      status: 'healthy',
      data: health
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    }
  }
}

export async function checkAllServices() {
  const results = {
    backend: await checkServiceHealth(),
    timestamp: new Date().toISOString()
  }
  
  return results
}

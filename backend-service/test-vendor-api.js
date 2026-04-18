// Using built-in fetch (Node.js 18+)

const API_BASE = 'http://localhost:3001/api'

async function testVendorRegistration() {
  try {
    console.log('=== TESTING VENDOR REGISTRATION PROCESS ===\n')
    
    // Step 1: Register a new vendor
    console.log('1. Registering new vendor...')
    const registrationData = {
      name: 'Test Vendor API',
      email: `testapi${Date.now()}@example.com`,
      phone: '9876543210',
      password: 'testpassword123',
      vendorType: 'individual',
      location: {
        city: 'Test City',
        state: 'Test State',
        country: 'India'
      },
      role: 'vendor'
    }
    
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    })
    
    const registerResult = await registerResponse.json()
    console.log('Registration Response:', registerResult)
    
    if (!registerResult.success || !registerResult.token) {
      throw new Error('Registration failed')
    }
    
    const token = registerResult.token
    const vendorId = registerResult.user.id
    
    console.log('✅ Registration successful')
    console.log('Token:', token ? 'Received' : 'Missing')
    console.log('Vendor ID:', vendorId)
    
    // Step 2: Update vendor profile with additional data
    console.log('\n2. Updating vendor profile...')
    const profileData = {
      skills: [
        {
          name: 'JavaScript',
          level: 'Advanced',
          yearsOfExperience: 3
        },
        {
          name: 'React',
          level: 'Intermediate',
          yearsOfExperience: 2
        }
      ],
      services: [
        {
          name: 'Web Development',
          description: 'Full-stack web development services',
          minPrice: 5000,
          maxPrice: 50000,
          currency: 'INR',
          duration: '1-3 months'
        }
      ],
      portfolio: [
        {
          title: 'E-commerce Platform',
          description: 'A modern e-commerce platform built with React and Node.js',
          technologies: ['React', 'Node.js', 'MongoDB'],
          client: 'Test Client'
        }
      ],
      availability: {
        availableForProjects: true,
        responseTime: 'Within 24 hours',
        workingHours: '9 AM - 6 PM',
        timeZone: 'IST'
      },
      bio: 'Experienced web developer with expertise in modern technologies',
      website: 'https://testvendor.com'
    }
    
    const profileResponse = await fetch(`${API_BASE}/auth/vendor/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    })
    
    const profileResult = await profileResponse.json()
    console.log('Profile Update Response:', profileResult)
    
    if (profileResponse.ok) {
      console.log('✅ Profile update successful')
    } else {
      console.log('❌ Profile update failed')
      console.log('Status:', profileResponse.status)
      console.log('Error:', profileResult)
    }
    
    // Step 3: Verify the vendor data in database
    console.log('\n3. Verifying vendor data...')
    const verifyResponse = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const verifyResult = await verifyResponse.json()
    console.log('Verification Response:', verifyResult)
    
    console.log('\n=== TEST COMPLETED ===')
    
  } catch (error) {
    console.error('Test failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

testVendorRegistration()

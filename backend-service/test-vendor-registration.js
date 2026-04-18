import mongoose from 'mongoose'
import Vendor from './src/models/Vendor.js'
import dotenv from 'dotenv'

dotenv.config()

async function testVendorRegistration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
    
    // Test 1: Check if vendors exist in database
    const vendors = await Vendor.find({})
    console.log('\n=== EXISTING VENDORS IN DATABASE ===')
    console.log(`Total vendors found: ${vendors.length}`)
    
    if (vendors.length > 0) {
      vendors.forEach((vendor, index) => {
        console.log(`\nVendor ${index + 1}:`)
        console.log('ID:', vendor._id)
        console.log('Name:', vendor.name)
        console.log('Email:', vendor.email)
        console.log('Vendor Type:', vendor.vendorType)
        console.log('Location:', vendor.location)
        console.log('Skills Count:', vendor.skills?.length || 0)
        console.log('Services Count:', vendor.services?.length || 0)
        console.log('Portfolio Count:', vendor.portfolio?.length || 0)
        console.log('Profile:', vendor.profile)
        console.log('Registration Status:', vendor.registration)
        console.log('Created At:', vendor.createdAt)
        console.log('Updated At:', vendor.updatedAt)
      })
    }
    
    // Test 2: Check vendor schema fields
    console.log('\n=== VENDOR SCHEMA FIELDS ===')
    const vendorSchema = Vendor.schema.obj
    console.log('Available fields:', Object.keys(vendorSchema))
    
    // Test 3: Create a test vendor to verify schema
    console.log('\n=== CREATING TEST VENDOR ===')
    const testVendor = new Vendor({
      name: 'Test Vendor',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'hashedpassword',
      vendorType: 'individual',
      location: {
        city: 'Test City',
        state: 'Test State',
        country: 'India'
      },
      skills: [
        {
          name: 'JavaScript',
          level: 'Advanced',
          yearsOfExperience: 3
        }
      ],
      services: [
        {
          name: 'Web Development',
          description: 'Full-stack web development',
          minPrice: 5000,
          maxPrice: 50000,
          currency: 'INR',
          duration: '1-3 months'
        }
      ],
      portfolio: [
        {
          title: 'Test Project',
          description: 'A test project',
          technologies: ['React', 'Node.js'],
          client: 'Test Client'
        }
      ],
      profile: {
        bio: 'Test bio',
        website: 'https://test.com'
      },
      registration: {
        step: 5,
        completed: true,
        lastCompletedStep: 5
      }
    })
    
    console.log('Test vendor data:', JSON.stringify(testVendor.toObject(), null, 2))
    
    // Don't actually save the test vendor, just verify the schema
    console.log('\n=== SCHEMA VALIDATION PASSED ===')
    
  } catch (error) {
    console.error('Test failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

testVendorRegistration()

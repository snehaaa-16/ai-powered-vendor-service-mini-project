import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../utils/toast.js'
import { api, setAuthToken } from '../../lib/api.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function VendorPreviewPage() {
  const [allData, setAllData] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { updateUserState } = useAuth()

  useEffect(() => {
    // Collect all data from localStorage
    const registrationData = JSON.parse(localStorage.getItem('vendorRegistrationData') || '{}')
    const skills = JSON.parse(localStorage.getItem('vendorSkills') || '[]')
    const services = JSON.parse(localStorage.getItem('vendorServices') || '[]')
    const projects = JSON.parse(localStorage.getItem('vendorProjects') || '[]')
    const availability = JSON.parse(localStorage.getItem('vendorAvailability') || '{}')

    console.log('=== FRONTEND: COLLECTING LOCALSTORAGE DATA ===')
    console.log('Registration Data from localStorage:', registrationData)
    console.log('Skills from localStorage:', skills)
    console.log('Services from localStorage:', services)
    console.log('Projects from localStorage:', projects)
    console.log('Availability from localStorage:', availability)

    setAllData({
      registration: registrationData,
      skills,
      services,
      projects,
      availability
    })
  }, [])

  const handleSubmitRegistration = async () => {
    setLoading(true)
    
    try {
      // Prepare registration data to match backend expectations
      const registrationData = {
        name: allData.registration.businessName,
        email: allData.registration.email,
        phone: allData.registration.phone,
        password: allData.registration.password,
        vendorType: allData.registration.vendorType,
        location: allData.registration.address,
        role: 'vendor'
      }
      
      console.log('=== FRONTEND: VENDOR REGISTRATION DATA ===')
      console.log('Registration Data being sent:', registrationData)
      console.log('All collected data:', allData)
      
      // Call registration API
      const response = await api.post('/auth/register', registrationData)
      
      console.log('=== REGISTRATION RESPONSE ===')
      console.log('Response:', response)
      
      if (response.success && response.token) {
        // Set authentication token
        setAuthToken(response.token)
        console.log('=== AUTH TOKEN SET ===')
        console.log('Token set:', response.token ? 'YES' : 'NO')
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(response.user))
        console.log('=== USER INFO STORED ===')
        console.log('User stored:', response.user)
         
         // Save additional vendor data (skills, services, projects, availability)
         try {
                       // Transform skills data to match backend schema
            const transformedSkills = allData.skills?.map(skill => ({
              name: skill.name,
              level: skill.proficiency, // Map 'proficiency' to 'level'
              yearsOfExperience: skill.experience // Map 'experience' to 'yearsOfExperience'
            })) || []

            // Transform projects data to match backend schema
            const transformedProjects = allData.projects?.map(project => ({
              title: project.title,
              description: project.description,
              projectUrl: project.url, // Map 'url' to 'projectUrl'
              technologies: project.tech ? project.tech.split(',').map(t => t.trim()) : [], // Convert 'tech' string to 'technologies' array
              client: 'Client', // Default value since frontend doesn't collect this
              completedDate: new Date() // Default to current date
            })) || []

            const vendorData = {
              skills: transformedSkills,
              services: allData.services,
              portfolio: transformedProjects, // Use transformed projects
              availability: allData.availability,
              bio: allData.registration.bio,
              website: allData.registration.website
            }
           
           console.log('=== FRONTEND: VENDOR PROFILE DATA ===')
           console.log('Profile Data being sent:', vendorData)
           
           // Call API to save vendor profile data
           const profileResponse = await api.post('/auth/vendor/profile', vendorData)
           console.log('=== VENDOR PROFILE UPDATE SUCCESS ===')
           console.log('Profile update response:', profileResponse)
         } catch (profileError) {
           console.error('=== VENDOR PROFILE UPDATE FAILED ===')
           console.error('Error details:', profileError)
           console.error('Error message:', profileError.message)
           console.error('Error response:', profileError.response)
           // Don't fail registration if profile data save fails
         }
         
         // Clear registration data from localStorage
         localStorage.removeItem('vendorRegistrationData')
         localStorage.removeItem('vendorSkills')
         localStorage.removeItem('vendorServices')
         localStorage.removeItem('vendorProjects')
         localStorage.removeItem('vendorAvailability')
         
         // Update user state in context
         await updateUserState()
         
         // Show success toast
         showToast('Registration Successful', `Welcome to our platform, ${response.user.name}!`, 'success')
         
                 // Navigate to home page for vendors
        navigate('/')
         
       } else {
         throw new Error('Registration failed - invalid response')
       }
      
    } catch (error) {
      console.error('Registration error:', error)
      showToast('Registration Failed', error.message || 'Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate('/register/new-vendor/step5')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 border border-dashed border-white/20">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Review Your Information</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            <p className="text-slate-400 mt-4">Please review all your information before final submission</p>
          </div>

          <div className="space-y-6 max-h-96 overflow-y-auto">
            {/* Basic Information */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-400">Name:</span> <span className="text-white">{allData.registration?.businessName}</span></div>
                <div><span className="text-slate-400">Email:</span> <span className="text-white">{allData.registration?.email}</span></div>
                <div><span className="text-slate-400">Phone:</span> <span className="text-white">{allData.registration?.phone}</span></div>
                <div><span className="text-slate-400">Vendor Type:</span> <span className="text-white">{allData.registration?.vendorType}</span></div>
                <div><span className="text-slate-400">Location:</span> <span className="text-white">{allData.registration?.address?.city}, {allData.registration?.address?.state}</span></div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Skills ({allData.skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {allData.skills?.map((skill, index) => (
                  <span key={index} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    {skill.name} ({skill.experience}y, {skill.proficiency})
                  </span>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Services ({allData.services?.length || 0})
              </h3>
              <div className="space-y-2">
                {allData.services?.map((service, index) => (
                  <div key={index} className="bg-slate-600 rounded p-2">
                    <div className="font-medium text-white">{service.name}</div>
                    <div className="text-sm text-slate-300">₹{service.minPrice} - ₹{service.maxPrice} • {service.duration}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 text-orange-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Projects ({allData.projects?.length || 0})
              </h3>
              <div className="space-y-2">
                {allData.projects?.map((project, index) => (
                  <div key={index} className="bg-slate-600 rounded p-2">
                    <div className="font-medium text-white">{project.title}</div>
                    <div className="text-sm text-slate-300">{project.tech}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-400">Available:</span> <span className="text-white">{allData.availability?.availableForProjects ? 'Yes' : 'No'}</span></div>
                <div><span className="text-slate-400">Response Time:</span> <span className="text-white">{allData.availability?.responseTime}</span></div>
                <div><span className="text-slate-400">Working Hours:</span> <span className="text-white">{allData.availability?.workingHours}</span></div>
                <div><span className="text-slate-400">Time Zone:</span> <span className="text-white">{allData.availability?.timeZone}</span></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleGoBack}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Go Back
            </button>
            <button
              onClick={handleSubmitRegistration}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

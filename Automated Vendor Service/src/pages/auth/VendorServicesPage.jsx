import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VendorServicesPage() {
  const [existingServices, setExistingServices] = useState([])
  
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    minPrice: '',
    maxPrice: '',
    currency: 'INR',
    duration: ''
  })
  
  const navigate = useNavigate()

  const handleNewServiceChange = (field, value) => {
    setNewService(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addService = () => {
    if (newService.name.trim()) {
      const serviceToAdd = {
        id: Date.now(),
        name: newService.name,
        description: newService.description,
        minPrice: parseInt(newService.minPrice) || 0,
        maxPrice: parseInt(newService.maxPrice) || 0,
        currency: newService.currency,
        duration: newService.duration
      }
      setExistingServices(prev => [...prev, serviceToAdd])
      setNewService({
        name: '',
        description: '',
        minPrice: '',
        maxPrice: '',
        currency: 'INR',
        duration: ''
      })
    }
  }

  const removeService = (serviceId) => {
    setExistingServices(prev => prev.filter(service => service.id !== serviceId))
  }

  const handleSaveAndContinue = () => {
    // Validate that at least one service is added
    if (existingServices.length === 0) {
      alert('Please add at least one service before continuing.')
      return
    }
    
    // Save services to localStorage or state management
    localStorage.setItem('vendorServices', JSON.stringify(existingServices))
    // Navigate to next step (you can change this route as needed)
    navigate('/register/new-vendor/step4')
  }

  const handleGoBack = () => {
    navigate('/register/new-vendor/step2')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 border border-dashed border-white/20">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Add Your Services</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* Services & Pricing Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-semibold text-white">Services & Pricing</h2>
            </div>

            {/* Existing Services */}
            <div className="space-y-4">
              {existingServices.map((service, index) => (
                <div key={service.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-lg">Service {index + 1}: {service.name}</h3>
                      <div className="space-y-1 mt-2 text-sm text-slate-300">
                        <p>Description: {service.description}</p>
                        <p>Price: {formatPrice(service.minPrice)} - {formatPrice(service.maxPrice)}</p>
                        <p>Duration: {service.duration}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeService(service.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                      [Remove]
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Another Service Button */}
            <div className="text-center">
              <button
                onClick={addService}
                className="inline-flex items-center space-x-2 px-6 py-3 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>+ Add Another Service</span>
              </button>
            </div>

            {/* Add New Service Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <h3 className="text-white font-medium">Add New Service</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {/* Service Name */}
                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium">Service Name: *</label>
                   <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => handleNewServiceChange('name', e.target.value)}
                    placeholder="Mobile App Development"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                                 {/* Description */}
                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium">Description: *</label>
                   <input
                    type="text"
                    value={newService.description}
                    onChange={(e) => handleNewServiceChange('description', e.target.value)}
                    placeholder="Cross-platform mobile apps..."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                                 {/* Min Price */}
                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium">Min Price: *</label>
                   <input
                    type="number"
                    value={newService.minPrice}
                    onChange={(e) => handleNewServiceChange('minPrice', e.target.value)}
                    placeholder="50000"
                    min="0"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                                 {/* Max Price */}
                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium">Max Price: *</label>
                   <input
                    type="number"
                    value={newService.maxPrice}
                    onChange={(e) => handleNewServiceChange('maxPrice', e.target.value)}
                    placeholder="300000"
                    min="0"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Currency:</label>
                  <select
                    value={newService.currency}
                    onChange={(e) => handleNewServiceChange('currency', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                                 {/* Duration */}
                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium">Duration: *</label>
                   <input
                    type="text"
                    value={newService.duration}
                    onChange={(e) => handleNewServiceChange('duration', e.target.value)}
                    placeholder="4-12 weeks"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleGoBack}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={handleSaveAndContinue}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

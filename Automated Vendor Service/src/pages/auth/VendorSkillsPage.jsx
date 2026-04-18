import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VendorSkillsPage() {
  const [existingSkills, setExistingSkills] = useState([])
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    experience: '',
    proficiency: 'Beginner'
  })
  
  const navigate = useNavigate()

  const handleNewSkillChange = (field, value) => {
    setNewSkill(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const skillToAdd = {
        id: Date.now(),
        name: newSkill.name,
        experience: parseInt(newSkill.experience) || 0,
        proficiency: newSkill.proficiency
      }
      setExistingSkills(prev => [...prev, skillToAdd])
      setNewSkill({ name: '', experience: '', proficiency: 'Beginner' })
    }
  }

  const removeSkill = (skillId) => {
    setExistingSkills(prev => prev.filter(skill => skill.id !== skillId))
  }

  const handleSaveAndContinue = () => {
    // Validate that at least one skill is added
    if (existingSkills.length === 0) {
      alert('Please add at least one skill before continuing.')
      return
    }
    
    // Save skills to localStorage or state management
    localStorage.setItem('vendorSkills', JSON.stringify(existingSkills))
    // Navigate to next step (you can change this route as needed)
    navigate('/register/new-vendor/step3')
  }

  const handleGoBack = () => {
    navigate('/register/new-vendor')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 border border-dashed border-white/20">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Add Your Skills</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* Skills & Expertise Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-semibold text-white">Skills & Expertise</h2>
            </div>

            {/* Existing Skills */}
            <div className="space-y-4">
              {existingSkills.map((skill) => (
                <div key={skill.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-lg">{skill.name}</h3>
                      <div className="flex space-x-4 mt-2 text-sm text-slate-300">
                        <span>Experience: {skill.experience} years</span>
                        <span>Proficiency: {skill.proficiency}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                      [Remove]
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Another Skill Button */}
            <div className="text-center">
              <button
                onClick={addSkill}
                className="inline-flex items-center space-x-2 px-6 py-3 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>+ Add Another Skill</span>
              </button>
            </div>

            {/* Add New Skill Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <h3 className="text-white font-medium">Add New Skill</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 {/* Skill Name */}
                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium">Skill Name *</label>
                   <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => handleNewSkillChange('name', e.target.value)}
                    placeholder="e.g., TypeScript"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                                 {/* Years of Experience */}
                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium">Years of Experience *</label>
                   <input
                    type="number"
                    value={newSkill.experience}
                    onChange={(e) => handleNewSkillChange('experience', e.target.value)}
                    placeholder="4"
                    min="0"
                    max="50"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                                 {/* Proficiency */}
                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium">Proficiency *</label>
                   <select
                    value={newSkill.proficiency}
                    onChange={(e) => handleNewSkillChange('proficiency', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
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

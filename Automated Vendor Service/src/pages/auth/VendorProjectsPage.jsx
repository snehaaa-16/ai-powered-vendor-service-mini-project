import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VendorProjectsPage() {
  const [existingProjects, setExistingProjects] = useState([])
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    url: '',
    tech: '',
    images: []
  })
  
  const navigate = useNavigate()

  const handleNewProjectChange = (field, value) => {
    setNewProject(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setNewProject(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim() && newProject.tech.trim()) {
      const projectToAdd = {
        id: Date.now(),
        title: newProject.title,
        description: newProject.description,
        url: newProject.url,
        tech: newProject.tech,
        images: newProject.images
      }
      setExistingProjects(prev => [...prev, projectToAdd])
      setNewProject({
        title: '',
        description: '',
        url: '',
        tech: '',
        images: []
      })
    } else {
      alert('Please fill in project title, description, and technologies.')
    }
  }

  const removeProject = (projectId) => {
    setExistingProjects(prev => prev.filter(project => project.id !== projectId))
  }

  const handleSaveAndContinue = () => {
    // Save projects to localStorage or state management
    localStorage.setItem('vendorProjects', JSON.stringify(existingProjects))
    // Navigate to next step (you can change this route as needed)
    navigate('/register/new-vendor/step5')
  }

  const handleGoBack = () => {
    navigate('/register/new-vendor/step3')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 border border-dashed border-white/20">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Add Your Projects</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* Portfolio Projects Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-semibold text-white">Portfolio Projects</h2>
            </div>

            {/* Existing Projects */}
            <div className="space-y-4">
              {existingProjects.map((project, index) => (
                <div key={project.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-lg">Project {index + 1}: {project.title}</h3>
                      <div className="space-y-1 mt-2 text-sm text-slate-300">
                        <p>Description: {project.description}</p>
                        <p>URL: <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{project.url}</a></p>
                        <p>Tech: {project.tech}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                      [Remove]
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Another Project Button */}
            <div className="text-center">
              <button
                onClick={addProject}
                className="inline-flex items-center space-x-2 px-6 py-3 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>+ Add Another Project</span>
              </button>
            </div>

            {/* Add New Project Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <h3 className="text-white font-medium">Add New Project</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {/* Project Title */}
                 <div className="md:col-span-2 space-y-2">
                   <label className="text-white text-sm font-medium">Project Title: *</label>
                   <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => handleNewProjectChange('title', e.target.value)}
                    placeholder="Banking App"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                                 {/* Description */}
                 <div className="md:col-span-2 space-y-2">
                   <label className="text-white text-sm font-medium">Description: *</label>
                   <textarea
                    value={newProject.description}
                    onChange={(e) => handleNewProjectChange('description', e.target.value)}
                    placeholder="Modern banking interface..."
                    rows="3"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Project URL */}
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Project URL:</label>
                  <input
                    type="url"
                    value={newProject.url}
                    onChange={(e) => handleNewProjectChange('url', e.target.value)}
                    placeholder="https://banking-app.com"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                                 {/* Technologies */}
                 <div className="space-y-2">
                   <label className="text-white text-sm font-medium">Technologies: *</label>
                   <input
                    type="text"
                    value={newProject.tech}
                    onChange={(e) => handleNewProjectChange('tech', e.target.value)}
                    placeholder="React, TypeScript, Node.js"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Project Images */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-white text-sm font-medium">Project Images:</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {newProject.images.length > 0 && (
                    <div className="text-sm text-slate-400">
                      {newProject.images.length} file(s) selected
                    </div>
                  )}
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

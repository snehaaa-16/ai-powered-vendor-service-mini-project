import React from 'react'

const Step2SkillsExpertise = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Step 2: Skills & Expertise
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        What are your core skills and areas of expertise?
      </p>
      
      {/* Skills & Expertise Section */}
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills & Expertise</h3>
        </div>

        {/* Existing Skills List */}
        <div className="space-y-3">
          {formData.step2.skills && formData.step2.skills.length > 0 ? (
            formData.step2.skills.map((skill, index) => (
              <div key={index} className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 relative">
                <div className="absolute right-4 top-4 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
                <div className="pr-8">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Skill {index + 1}: {skill.name}
                    </h4>
                    <button
                      onClick={() => {
                        const updatedSkills = formData.step2.skills.filter((_, i) => i !== index)
                        handleInputChange('step2', 'skills', updatedSkills)
                      }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      [Remove]
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Experience:</strong> {skill.experience} years</p>
                    <p><strong>Proficiency:</strong> {skill.proficiency}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No skills added yet. Add your first skill below.</p>
            </div>
          )}
        </div>

        {/* Add Another Skill Button */}
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800 relative">
          <div className="absolute right-4 top-4 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
          <div className="pr-8">
            <button
              onClick={() => {
                const newSkill = {
                  name: '',
                  experience: '',
                  proficiency: 'Beginner'
                }
                const updatedSkills = [...(formData.step2.skills || []), newSkill]
                handleInputChange('step2', 'skills', updatedSkills)
              }}
              className="w-full text-center py-3 text-purple-600 hover:text-purple-700 font-medium border-2 border-dashed border-purple-300 hover:border-purple-400 rounded-lg transition-colors"
            >
              + Add Another Skill
            </button>
          </div>
        </div>

        {/* Add New Skill Form */}
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-6 bg-white dark:bg-slate-800">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
            </svg>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Add New Skill</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Skill Name */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skill Name:
                </label>
                <input
                  type="text"
                  value={formData.step2.newSkillName || ''}
                  onChange={(e) => handleInputChange('step2', 'newSkillName', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="e.g., React.js"
                />
              </div>
            </div>

            {/* Years of Experience */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience:
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.step2.newSkillExperience || ''}
                  onChange={(e) => handleInputChange('step2', 'newSkillExperience', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  placeholder="e.g., 3"
                />
              </div>
            </div>

            {/* Proficiency Level */}
            <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 relative">
              <div className="absolute right-3 top-3 border-l-2 border-dashed border-gray-300 dark:border-slate-500 h-full"></div>
              <div className="pr-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Proficiency Level:
                </label>
                <select
                  value={formData.step2.newSkillProficiency || 'Beginner'}
                  onChange={(e) => handleInputChange('step2', 'newSkillProficiency', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add Skill Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                if (formData.step2.newSkillName && formData.step2.newSkillExperience) {
                  const newSkill = {
                    name: formData.step2.newSkillName,
                    experience: parseInt(formData.step2.newSkillExperience),
                    proficiency: formData.step2.newSkillProficiency
                  }
                  const updatedSkills = [...(formData.step2.skills || []), newSkill]
                  handleInputChange('step2', 'skills', updatedSkills)
                  
                  // Clear the form
                  handleInputChange('step2', 'newSkillName', '')
                  handleInputChange('step2', 'newSkillExperience', '')
                  handleInputChange('step2', 'newSkillProficiency', 'Beginner')
                }
              }}
              disabled={!formData.step2.newSkillName || !formData.step2.newSkillExperience}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Add Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2SkillsExpertise

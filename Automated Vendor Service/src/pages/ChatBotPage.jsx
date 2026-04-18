import React, { useEffect, useRef, useState } from 'react'
import { startConversation, sendUserMessage, getSocket } from '../lib/socket.js'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, API_BASE } from '../lib/api.js'

export default function ChatBotPage() {
  // Chat states
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [conversationId] = useState(() => `c_${Date.now()}`)
  const listRef = useRef(null)
  const navigate = useNavigate()

  // Vendor data states
  const [vendorId, setVendorId] = useState('')
  const [vendorData, setVendorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // AI Config states
  const [aiConfig, setAiConfig] = useState({
    systemPrompt: '',
    modelName: 'gemini-2.5-flash',
    temperature: 0.4
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    skills: false,
    services: false,
    portfolio: false
  })

  // Fetch vendor data and AI config on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
      const user = await getCurrentUser()
        
        if (!user || user.role !== 'vendor') {
          setError('Access denied. Vendor role required.')
          setLoading(false)
          return
        }

        setVendorId(user.id)

        // Fetch full vendor details
        const token = localStorage.getItem('token')
        const vendorResponse = await fetch(`${API_BASE}/vendor/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!vendorResponse.ok) {
          throw new Error(`Failed to fetch vendor data: ${vendorResponse.status}`)
        }
        
        const vendorResult = await vendorResponse.json()
        
        if (vendorResult.success && vendorResult.vendor) {
          setVendorData(vendorResult.vendor)
        } else {
          console.warn('No vendor data found:', vendorResult)
        }

        // Fetch AI config
        const configResponse = await fetch(`${API_BASE}/vendor-ai-config/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (configResponse.ok) {
          const configResult = await configResponse.json()
          
          if (configResult.success && configResult.config) {
            setAiConfig({
              systemPrompt: configResult.config.systemPrompt || '',
              modelName: configResult.config.modelName || 'gemini-2.5-flash',
              temperature: configResult.config.temperature || 0.4
            })
          }
        } else {
          console.warn('Failed to fetch AI config:', configResponse.status)
          // Continue with default config
        }

        setLoading(false)
      } catch (err) {
        console.error('Failed to load data:', err)
        setError(`Failed to load vendor data: ${err.message}`)
        setLoading(false)
      }
    })()
  }, [])

  // Socket setup for chat testing
  useEffect(() => {
    if (!vendorId) return

    const s = getSocket()
    const onReady = () => {}
    const onUser = ({ message }) => {
      setMessages(prev => [...prev, { role: 'user', content: message }])
    }
    const onAssistant = ({ message }) => {
      setMessages(prev => [...prev, { role: 'assistant', content: message }])
    }

    s.on('chat:ready', onReady)
    s.on('chat:user_message', onUser)
    s.on('chat:assistant_message', onAssistant)
    startConversation({ conversationId, vendorId, userId: vendorId })

    return () => {
      s.off('chat:ready', onReady)
      s.off('chat:user_message', onUser)
      s.off('chat:assistant_message', onAssistant)
    }
  }, [conversationId, vendorId])

  // Auto-scroll chat
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text) return
    sendUserMessage({ conversationId, vendorId, message: text })
    setInput('')
  }

  const clearChat = () => {
    setMessages([])
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const saveAIConfig = async () => {
    try {
      setIsSaving(true)
      setSaveSuccess(false)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_BASE}/vendor-ai-config/${vendorId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(aiConfig)
      })

      const result = await response.json()
      
      if (result.success) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        alert('Failed to save configuration')
      }
    } catch (err) {
      console.error('Failed to save AI config:', err)
      alert('Failed to save configuration')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white">Loading vendor bot...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">My AI Vendor Bot</h1>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT PANEL: Vendor Profile + AI Config */}
          <div className="space-y-6">
            {/* Vendor Profile Section */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Vendor Profile</h2>
              
              {vendorData ? (
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div>
                    <div className="text-2xl font-bold text-white">{vendorData.name}</div>
                    <div className="text-sm text-slate-300">{vendorData.email}</div>
                    <div className="text-sm text-slate-400 mt-1">
                      {vendorData.location?.city}, {vendorData.location?.state} • {vendorData.vendorType}
                    </div>
                  </div>

                  {/* Bio */}
                  {vendorData.profile?.bio && (
                    <div>
                      <div className="text-sm font-semibold text-slate-300 mb-1">Bio</div>
                      <div className="text-sm text-slate-400">{vendorData.profile.bio}</div>
                    </div>
                  )}

                  {/* Skills */}
                  {vendorData.skills && vendorData.skills.length > 0 && (
                    <div>
                      <button
                        onClick={() => toggleSection('skills')}
                        className="w-full flex items-center justify-between text-sm font-semibold text-slate-300 mb-2 hover:text-white transition-colors"
                      >
                        <span>Skills ({vendorData.skills.length})</span>
                        <span>{expandedSections.skills ? '▼' : '▶'}</span>
                      </button>
                      {expandedSections.skills && (
                        <div className="flex flex-wrap gap-2">
                          {vendorData.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-xs text-purple-300"
                            >
                              {skill.name} • {skill.level} • {skill.yearsOfExperience || 0}y
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Services */}
                  {vendorData.services && vendorData.services.length > 0 && (
                    <div>
                      <button
                        onClick={() => toggleSection('services')}
                        className="w-full flex items-center justify-between text-sm font-semibold text-slate-300 mb-2 hover:text-white transition-colors"
                      >
                        <span>Services ({vendorData.services.length})</span>
                        <span>{expandedSections.services ? '▼' : '▶'}</span>
                      </button>
                      {expandedSections.services && (
                        <div className="space-y-2">
                          {vendorData.services.map((service, idx) => (
                            <div key={idx} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                              <div className="font-medium text-white text-sm">{service.name}</div>
                              <div className="text-xs text-slate-400 mt-1">
                                ₹{service.minPrice || 0} - ₹{service.maxPrice || 0} {service.currency || 'INR'}
                              </div>
                              {service.description && (
                                <div className="text-xs text-slate-400 mt-1">{service.description}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Availability */}
                  <div>
                    <div className="text-sm font-semibold text-slate-300 mb-2">Availability</div>
                    <div className="text-sm text-slate-400">
                      <div>Status: <span className="text-green-400">{vendorData.availabilityStatus || 'available'}</span></div>
                      {vendorData.responseTime && <div>Response Time: {vendorData.responseTime}</div>}
                      {vendorData.workingHours && <div>Working Hours: {vendorData.workingHours}</div>}
                    </div>
                  </div>

                  {/* Portfolio */}
                  {vendorData.portfolio && vendorData.portfolio.length > 0 && (
                    <div>
                      <button
                        onClick={() => toggleSection('portfolio')}
                        className="w-full flex items-center justify-between text-sm font-semibold text-slate-300 mb-2 hover:text-white transition-colors"
                      >
                        <span>Portfolio ({vendorData.portfolio.length})</span>
                        <span>{expandedSections.portfolio ? '▼' : '▶'}</span>
                      </button>
                      {expandedSections.portfolio && (
                        <div className="space-y-2">
                          {vendorData.portfolio.map((project, idx) => (
                            <div key={idx} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                              <div className="font-medium text-white text-sm">{project.title}</div>
                              {project.description && (
                                <div className="text-xs text-slate-400 mt-1">{project.description}</div>
                              )}
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.technologies.map((tech, techIdx) => (
                                    <span key={techIdx} className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded text-xs text-blue-300">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-400 text-sm">
                  <div className="mb-2">⚠️ Vendor profile not found</div>
                  <div className="text-xs">Please complete your vendor registration to use the bot testing interface.</div>
                </div>
              )}
            </div>

            {/* AI Configuration Section */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Bot Configuration</h2>
              
              <div className="space-y-4">
                {/* System Prompt */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    System Prompt
                    <span className="ml-2 text-xs font-normal text-slate-400">(Define your bot's personality)</span>
                  </label>
                  <textarea
                    value={aiConfig.systemPrompt}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    className="w-full h-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="e.g., You are a professional web developer who specializes in React and Node.js..."
                  />
                </div>

                {/* Model Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Model
                    <span className="ml-2 text-xs font-normal text-slate-400">(AI model to use)</span>
                  </label>
                  <select
                    value={aiConfig.modelName}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, modelName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast)</option>
                    <option value="gemini-pro">Gemini Pro (Balanced)</option>
                    <option value="gemini-ultra">Gemini Ultra (Advanced)</option>
                  </select>
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Temperature: {aiConfig.temperature.toFixed(2)}
                    <span className="ml-2 text-xs font-normal text-slate-400">(Creativity level: 0=precise, 1=creative)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={aiConfig.temperature}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Precise</span>
                    <span>Creative</span>
          </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={saveAIConfig}
                  disabled={isSaving}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                >
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>

                {saveSuccess && (
                  <div className="text-center text-sm text-green-400 animate-pulse">
                    ✓ Configuration saved successfully!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Chat Testing Interface */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col" style={{ height: 'fit-content', minHeight: '600px' }}>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Test Your Bot Clone</h2>
              <p className="text-sm text-slate-400 mt-1">
                Type as if you're a potential client. See how your bot responds on your behalf.
              </p>
            </div>

            {/* Chat Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto bg-slate-900/40 rounded-xl p-4 space-y-3 mb-4" style={{ minHeight: '400px', maxHeight: '500px' }}>
              {messages.length === 0 ? (
                <div className="text-center text-slate-500 text-sm mt-8">
                  <div className="mb-2">💬</div>
                  <div>Start a conversation to test your bot!</div>
                  <div className="text-xs mt-2">Try asking: "What services do you offer?"</div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <div className={m.role === 'user' 
                      ? 'inline-block bg-purple-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-left' 
                      : 'inline-block bg-slate-700 text-white px-4 py-2 rounded-2xl rounded-tl-sm max-w-[80%] text-left'}>
                      <div className="text-xs opacity-70 mb-1">
                        {m.role === 'user' ? 'Mock Client' : 'Your Bot'}
                      </div>
                      <div className="text-sm">{m.content}</div>
                    </div>
          </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' ? send() : null}
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Type as a potential client..."
                />
                <button
                  onClick={send}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Send
                </button>
              </div>
              
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  Clear Chat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

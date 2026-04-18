import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ChatSummaryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { conversationId, history = [] } = location.state || {}
  const [bullets, setBullets] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const aiBase = import.meta.env.VITE_AI_URL || 'http://localhost:3002'
        const res = await fetch(`${aiBase}/api/chat/summarize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history })
        })
        const data = await res.json()
        if (data.success) setBullets(data.bullets || [])
        else setError(data.error || 'Failed to summarize')
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [history])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Summary</h1>
          <button onClick={() => navigate('/')} className="px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm">Done</button>
        </div>
        {loading && <div className="mt-4">Generating summary...</div>}
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {!loading && !error && (
          <ul className="mt-4 list-disc pl-6 space-y-2 text-gray-800 dark:text-gray-200">
            {bullets.map((b, i) => (<li key={i}>{b}</li>))}
          </ul>
        )}
      </div>
    </div>
  )
}




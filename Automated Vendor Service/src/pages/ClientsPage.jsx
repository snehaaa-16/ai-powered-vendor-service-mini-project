import React, { useEffect, useState } from 'react'
import { getCurrentUser } from '../lib/api.js'

export default function ClientsPage() {
  const [conversations, setConversations] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      setError('')
      try {
        const user = await getCurrentUser()
        if (!user?.id) throw new Error('Not authenticated')
        // For demo purposes, fetch from socket-service read endpoints if available; otherwise leave empty
        // You can wire a backend endpoint to list conversations for this vendor/client
      } catch (e) { setError(e.message) }
      finally { setLoading(false) }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{(JSON.parse(localStorage.getItem('user')||'{}').role === 'vendor') ? 'Clients Conversations' : 'Vendor Conversations'}</h1>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center">🔔</div>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{notifications.length}</span>
            )}
          </div>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && conversations.length === 0 && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8 text-center text-gray-600 dark:text-gray-300">
            No conversations yet.
          </div>
        )}

        {conversations.length > 0 && (
          <div className="grid gap-3">
            {conversations.map((c, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">Conversation {c.conversationId}</div>
                <ul className="list-disc pl-5 text-gray-800 dark:text-gray-200 mt-2">
                  {(c.summary || []).map((s, j) => (<li key={j}>{s}</li>))}
                </ul>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Status: {c.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

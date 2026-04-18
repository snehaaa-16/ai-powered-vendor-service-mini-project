import React, { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function ChatHistoryPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)

  useEffect(() => {
    (async () => {
      if (!user) return
      setLoading(true)
      setError('')
      try {
        const path =
          user.role === 'vendor' ? '/chat-history/vendor' : '/chat-history/client'
        const res = await api.get(path)
        if (res.success) {
          setConversations(res.conversations || [])
        } else {
          setError(res.error || 'Failed to load chat history')
        }
      } catch (e) {
        setError(e.message || 'Failed to load chat history')
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  const loadMessages = async (conversationId) => {
    setSelected(conversationId)
    setMessages([])
    setMessagesLoading(true)
    try {
      const res = await api.get(`/chat-history/${conversationId}/messages`)
      if (res.success) {
        setMessages(res.messages || [])
      } else {
        setMessages([])
      }
    } catch (e) {
      setMessages([])
    } finally {
      setMessagesLoading(false)
    }
  }

  const heading =
    user?.role === 'vendor' ? 'AI Chat History with Clients' : 'My AI Chat History with Vendors'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-6">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{heading}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Read-only history of conversations with the AI assistant. These records cannot be edited.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && conversations.length === 0 && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-800 dark:text-gray-100 font-semibold mb-1">
              No conversations yet
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start a chat from a vendor profile to see it appear here.
            </p>
          </div>
        )}

        {!loading && !error && conversations.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Conversations list */}
            <div className="md:col-span-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 max-h-[70vh] overflow-y-auto">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Conversations
              </h2>
              <div className="space-y-2 text-sm">
                {conversations.map((c) => {
                  const counterpart =
                    user?.role === 'vendor' ? c.client?.name : c.vendor?.name
                  const subtitle =
                    user?.role === 'vendor'
                      ? c.client?.email || 'Client'
                      : c.vendor?.location
                      ? `${c.vendor.location.city}, ${c.vendor.location.state}`
                      : ''
                  const last = c.lastMessageAt
                    ? new Date(c.lastMessageAt).toLocaleString()
                    : ''
                  return (
                    <button
                      key={c.conversationId}
                      onClick={() => loadMessages(c.conversationId)}
                      className={`w-full text-left px-3 py-2 rounded-xl border text-xs md:text-sm ${
                        selected === c.conversationId
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {counterpart || 'Conversation'}
                      </div>
                      {subtitle && (
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                          {subtitle}
                        </div>
                      )}
                      {last && (
                        <div className="text-[11px] text-gray-400 mt-1">
                          Last activity: {last}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Message view */}
            <div className="md:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col max-h-[70vh]">
              {(!selected || messagesLoading) && (
                <div className="flex-1 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  {messagesLoading
                    ? 'Loading conversation...'
                    : 'Select a conversation from the left to view the full history.'}
                </div>
              )}

              {selected && !messagesLoading && messages.length > 0 && (
                <>
                  <div className="flex-1 overflow-y-auto border border-gray-100 dark:border-slate-700 rounded-xl p-3 bg-gray-50 dark:bg-slate-900/70 space-y-2 text-xs md:text-sm">
                    {messages.map((m, idx) => {
                      const isUser = m.role === 'user'
                      const isSystem = m.role === 'system'
                      return (
                        <div
                          key={idx}
                          className={
                            isSystem
                              ? 'flex justify-center'
                              : isUser
                              ? 'flex justify-end'
                              : 'flex justify-start'
                          }
                        >
                          <div
                            className={[
                              'max-w-[80%] px-3 py-2 rounded-2xl leading-snug',
                              isSystem
                                ? 'bg-amber-500/10 text-amber-800 dark:text-amber-200 border border-amber-300/40'
                                : isUser
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-800 text-slate-50 border border-slate-700',
                            ].join(' ')}
                          >
                            {m.content}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 text-center">
                    This history is read-only and kept as a permanent record of what the client
                    requested and how the AI responded.
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



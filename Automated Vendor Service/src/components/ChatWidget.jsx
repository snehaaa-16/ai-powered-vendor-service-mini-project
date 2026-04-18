import React, { useEffect, useRef, useState } from 'react'
import { getCurrentUser } from '../lib/api.js'
import { useNavigate } from 'react-router-dom'
import { getSocket, sendUserMessage, startConversation } from '../lib/socket.js'

export default function ChatWidget({ vendorId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [conversationId] = useState(() => `c_${Date.now()}`)
  const [userId, setUserId] = useState('')
  const listRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser()
      if (user?.id) setUserId(user.id)
    })()
  }, [])

  useEffect(() => {
    const s = getSocket()
    const onReady = () => {}
    const onUser = ({ message }) => {
      setMessages(prev => [...prev, { role: 'user', content: message }])
    }
    const onAssistant = ({ message }) => {
      setMessages(prev => [...prev, { role: 'assistant', content: message }])
    }
    const onAgreementReady = ({ agreement }) => {
      if (agreement) {
        setMessages(prev => [...prev, { role: 'system', content: `[Agreement ready] ${agreement.summary || ''}` }])
        setPendingAgreement(agreement)
      }
    }
    s.on('chat:ready', onReady)
    s.on('chat:user_message', onUser)
    s.on('chat:assistant_message', onAssistant)
    s.on('chat:agreement_ready', onAgreementReady)
    if (vendorId) startConversation({ conversationId, vendorId, userId })
    return () => {
      s.off('chat:ready', onReady)
      s.off('chat:user_message', onUser)
      s.off('chat:assistant_message', onAssistant)
      s.off('chat:agreement_ready', onAgreementReady)
    }
  }, [conversationId, vendorId, userId])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text) return
    sendUserMessage({ conversationId, vendorId, message: text })
    setInput('')
  }

  const [pendingAgreement, setPendingAgreement] = useState(null)
  const [showConsent, setShowConsent] = useState(false)
  const [contactDetails, setContactDetails] = useState('')
  const [consentError, setConsentError] = useState('')

  const agree = () => {
    if (!pendingAgreement) return
    // Open consent form before actually sending details to the vendor
    setShowConsent(true)
  }

  const confirmConsent = () => {
    const contact = contactDetails.trim()
    if (!contact) {
      setConsentError('Please provide an email or WhatsApp number for the vendor to contact you.')
      return
    }
    const s = getSocket()
    s.emit('chat:client_agree', {
      conversationId,
      vendorId,
      clientId: userId,
      agreement: pendingAgreement,
      contactDetails: contact,
    })
    setMessages(prev => [
      ...prev,
      { role: 'system', content: 'You agreed to the proposal and shared your contact details with the vendor.' },
    ])
    // Route to summary page with local chat history, including contact info
    const history = messages.concat([
      { role: 'system', content: JSON.stringify({ ...pendingAgreement, contactDetails: contact, vendorId }) },
    ])
    setShowConsent(false)
    setConsentError('')
    navigate('/chat-summary', { state: { conversationId, history } })
  }

  const cancelConsent = () => {
    setShowConsent(false)
    setConsentError('')
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Chat with AI Rep
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Ask questions about this vendor and your project.
          </p>
        </div>
      </div>

      <div
        ref={listRef}
        className="h-64 overflow-y-auto rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3 space-y-2 border border-slate-100 dark:border-slate-800"
      >
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 text-center px-4">
            Start the conversation by describing your project or asking a question.
          </div>
        )}
        {messages.map((m, i) => {
          const isUser = m.role === 'user'
          const isSystem = m.role === 'system'
          return (
            <div
              key={i}
              className={isSystem ? 'flex justify-center' : isUser ? 'flex justify-end' : 'flex justify-start'}
            >
              <div
                className={[
                  'max-w-[80%] px-3 py-2 rounded-2xl text-xs md:text-sm leading-snug',
                  isSystem
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/40'
                    : isUser
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-50 border border-slate-700',
                ].join(' ')}
              >
                {m.content}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => (e.key === 'Enter' ? send() : null)}
          className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Type a message"
        />
        <button
          onClick={send}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs md:text-sm font-semibold shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          Send
        </button>
      </div>

      {pendingAgreement && (
        <div className="mt-3 flex items-start gap-2 bg-amber-500/10 border border-amber-400/40 rounded-xl p-3 text-xs md:text-sm">
          <div className="text-lg">⚡</div>
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
              Agreement proposed
            </p>
            <p className="text-amber-800/90 dark:text-amber-200/90 text-xs mb-2">
              {pendingAgreement.summary || 'Review the proposal details before confirming.'}
            </p>
            <button
              onClick={agree}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors"
            >
              Agree & view summary
            </button>
          </div>
        </div>
      )}

      {showConsent && (
        <div className="mt-3 border border-purple-500/40 bg-purple-500/5 rounded-xl p-3 text-xs md:text-sm space-y-2">
          <p className="font-semibold text-purple-800 dark:text-purple-200">
            Share your contact details
          </p>
          <p className="text-[11px] text-purple-900/80 dark:text-purple-200/80">
            Before we share this agreement with the vendor, please provide an email address or
            WhatsApp number where they can reach you. These details will be included in the summary
            email sent to the vendor.
          </p>
          <textarea
            value={contactDetails}
            onChange={e => setContactDetails(e.target.value)}
            rows={2}
            placeholder="e.g. harshit@example.com, WhatsApp: +91-9876543210"
            className="w-full px-3 py-2 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-xs md:text-sm text-gray-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {consentError && (
            <p className="text-[11px] text-red-500">
              {consentError}
            </p>
          )}
          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={cancelConsent}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmConsent}
              className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700"
            >
              Share & confirm
            </button>
          </div>
        </div>
      )}
    </div>
  )
}



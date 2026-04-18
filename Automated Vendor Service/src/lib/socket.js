import { io } from 'socket.io-client'

const envUrl = import.meta.env.VITE_SOCKET_URL
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('SOCKET_URL') : null
let computedUrl = storedUrl || envUrl || 'http://localhost:3006'
if (typeof computedUrl === 'string' && computedUrl.includes('localhost:3003')) {
  computedUrl = 'http://localhost:3006'
}
const SOCKET_URL = computedUrl

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      withCredentials: false,
    })
    socket.on('connect_error', (err) => {
      console.error('Socket connect_error:', err?.message || err)
    })
    console.log('Socket connecting to:', SOCKET_URL)
  }
  return socket
}

export function startConversation({ conversationId, vendorId, userId }) {
  const s = getSocket()
  s.emit('chat:start', { conversationId, vendorId, userId })
}

export function sendUserMessage({ conversationId, vendorId, message }) {
  const s = getSocket()
  s.emit('chat:user_message', { conversationId, vendorId, message })
}



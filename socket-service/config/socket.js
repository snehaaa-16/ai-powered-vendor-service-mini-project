import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { sendChatSummaryEmail } from './mailer.js';
dotenv.config();
class SocketConnection {
  constructor() {
    this.io = null;
    this.isInitialized = false;
  }

  initialize(server) {
    if (this.isInitialized) {
      console.log('✅ Socket.io already initialized');
      return this.io;
    }

    try {
      this.io = new Server(server, {
        cors: {
          origin: process.env.FRONTEND_URL || true,
          methods: ["GET", "POST"],
          credentials: false
        },
        path: '/socket.io'
      });

      this.isInitialized = true;
      console.log('✅ Socket.io initialized');

      this.setupBasicHandlers();

      return this.io;
    } catch (error) {
      console.error('❌ Socket.io initialization error:', error);
      process.exit(1);
    }
  }

  setupBasicHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });

      socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
      });

      socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room: ${roomId}`);
      });

      // Minimal chat flow
      socket.on('chat:start', async (payload) => {
        const { conversationId, vendorId, userId } = payload || {}
        if (conversationId) {
          socket.join(conversationId)
          try {
            const { default: Conversation } = await import('../models/Conversation.js')
            await Conversation.findOneAndUpdate(
              { conversationId },
              { $setOnInsert: { vendorId, userId, status: 'active' }, lastMessageAt: new Date() },
              { upsert: true, new: true }
            )
          } catch {}
          socket.emit('chat:ready', { conversationId })
        }
      })

      // Agreement events
      socket.on('chat:client_agree', async (payload) => {
        try {
          const { conversationId, vendorId, clientId, agreement, contactDetails } = payload || {}
          if (!conversationId || !agreement) return
          const { default: Agreement } = await import('../models/Agreement.js')
          const doc = await Agreement.findOneAndUpdate(
            { conversationId },
            { $set: { vendorId, clientId, contactDetails, ...agreement, status: 'client_agreed' } },
            { upsert: true, new: true }
          )
          this.io.to(conversationId).emit('chat:agreement_client_agreed', { conversationId, agreement: doc })
          // Generate server-side summary and finalize conversation
          try {
            const { default: Message } = await import('../models/Message.js')
            const { default: Conversation } = await import('../models/Conversation.js')
            const { default: Vendor } = await import('../models/Vendor.js')
            const { default: Client } = await import('../models/Client.js')

            const msgs = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean()
            const history = msgs.map(m => ({ role: m.role, content: m.content }))

            const aiBase = process.env.AI_BASE_URL || 'http://localhost:3002'
            const resp = await fetch(`${aiBase}/api/chat/summarize`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ history })
            })
            const data = await resp.json()
            const bullets = data?.bullets || []
            const updatedConversation = await Conversation.findOneAndUpdate(
              { conversationId },
              { status: 'completed', summary: bullets },
              { new: true }
            )

            // Send summary email to vendor (best-effort)
            try {
              const vendor = vendorId ? await Vendor.findById(vendorId).lean() : null
              const client = clientId ? await Client.findById(clientId).lean() : null
              const contactInfo = doc?.contactDetails || contactDetails
              if (vendor?.email) {
                await sendChatSummaryEmail({
                  to: vendor.email,
                  vendorName: vendor.name,
                  clientName: client?.name,
                  bullets: updatedConversation?.summary || bullets,
                  history,
                  contactDetails: contactInfo || null
                })
              }
            } catch (mailError) {
              console.error('email error', mailError)
            }
          } catch (e) { console.error('summary error', e) }
        } catch (e) { console.error('agreement error', e) }
      })

      socket.on('chat:vendor_accept', async (payload) => {
        try {
          const { conversationId, vendorId, clientId } = payload || {}
          if (!conversationId) return
          const { default: Agreement } = await import('../models/Agreement.js')
          const doc = await Agreement.findOneAndUpdate(
            { conversationId },
            { $set: { status: 'vendor_accepted' } },
            { new: true }
          )
          this.io.to(conversationId).emit('chat:agreement_vendor_accepted', { conversationId, agreement: doc })
          // Queue notification for client and simulate email dispatch
          try {
            const { default: Notification } = await import('../models/Notification.js')
            await Notification.create({ clientId, vendorId, type: 'vendor_accept', payload: { conversationId }, status: 'queued' })
          } catch {}
        } catch (e) { console.error('agreement error', e) }
      })

      socket.on('chat:user_message', async (payload) => {
        try {
          const { conversationId, message, vendorId } = payload || {}
          if (!conversationId || !message) return
          // Broadcast and persist user message
          this.io.to(conversationId).emit('chat:user_message', { conversationId, message })
          try {
            const { default: Message } = await import('../models/Message.js')
            await Message.create({ conversationId, role: 'user', content: message })
          } catch {}
          // Fetch last few messages to maintain context
          let history = []
          try {
            const { default: Message } = await import('../models/Message.js')
            const last = await Message.find({ conversationId }).sort({ createdAt: 1 }).limit(20).lean()
            history = last.map(m => ({ role: m.role, content: m.content }))
          } catch {}
          // Call AI via REST on ai-service with history
          const baseUrl = process.env.AI_BASE_URL || 'http://localhost:3002'
          const r = await fetch(`${baseUrl}/api/chat/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history, message, vendorId })
          })
          const data = await r.json()
          const reply = data?.reply || 'Sorry, I could not generate a response.'
          this.io.to(conversationId).emit('chat:assistant_message', { conversationId, message: reply })
          try {
            const { default: Message } = await import('../models/Message.js')
            await Message.create({ conversationId, role: 'assistant', content: reply })
          } catch {}
          // Emit agreement CTA if Gemini indicates readiness
          if (data?.agreementReady) {
            this.io.to(conversationId).emit('chat:agreement_ready', { conversationId, agreement: data.agreement || null })
          }
          try {
            const { default: Conversation } = await import('../models/Conversation.js')
            await Conversation.findOneAndUpdate({ conversationId }, { lastMessageAt: new Date() })
          } catch {}
          this.io.to(conversationId).emit('chat:complete', { conversationId })
          // Queue a simple notification
          try {
            const { default: Notification } = await import('../models/Notification.js')
            if (vendorId) {
              await Notification.create({ vendorId, type: 'chat_summary', payload: { conversationId, lastMessage: reply } })
            }
          } catch {}
        } catch (e) {
          console.error('chat error', e)
        }
      })
    });
  }

  getIO() {
    return this.io;
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      connectedClients: this.io ? this.io.engine.clientsCount : 0
    };
  }
}

const socketConnection = new SocketConnection();

export default socketConnection; 
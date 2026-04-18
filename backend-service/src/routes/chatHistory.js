import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'
import Vendor from '../models/Vendor.js'
import Client from '../models/Client.js'

const router = Router()

// Get chat history list for current client
router.get('/client', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ success: false, error: 'Client role required' })
    }

    const clientId = req.user.id
    const conversations = await Conversation.find({ userId: clientId })
      .sort({ lastMessageAt: -1 })
      .lean()

    const vendorIds = conversations.map(c => c.vendorId).filter(Boolean)
    const vendors = await Vendor.find({ _id: { $in: vendorIds } })
      .select('name location')
      .lean()
    const vendorMap = new Map(vendors.map(v => [String(v._id), v]))

    const payload = conversations.map(c => ({
      conversationId: c.conversationId,
      status: c.status,
      lastMessageAt: c.lastMessageAt,
      summary: c.summary || [],
      vendor: vendorMap.get(String(c.vendorId)) || null,
    }))

    return res.json({ success: true, conversations: payload })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
})

// Get chat history list for current vendor
router.get('/vendor', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ success: false, error: 'Vendor role required' })
    }

    const vendorId = req.user.id
    const conversations = await Conversation.find({ vendorId })
      .sort({ lastMessageAt: -1 })
      .lean()

    const clientIds = conversations.map(c => c.userId).filter(Boolean)
    const clients = await Client.find({ _id: { $in: clientIds } })
      .select('name email')
      .lean()
    const clientMap = new Map(clients.map(c => [String(c._id), c]))

    const payload = conversations.map(c => ({
      conversationId: c.conversationId,
      status: c.status,
      lastMessageAt: c.lastMessageAt,
      summary: c.summary || [],
      client: clientMap.get(String(c.userId)) || null,
    }))

    return res.json({ success: true, conversations: payload })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
})

// Get full message history for a specific conversation
router.get('/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params
    const convo = await Conversation.findOne({ conversationId }).lean()
    if (!convo) {
      return res.status(404).json({ success: false, error: 'Conversation not found' })
    }

    // Authorize: user must be the client or vendor in this conversation
    const userId = String(req.user.id)
    const isClient = req.user.role === 'client' && String(convo.userId) === userId
    const isVendor = req.user.role === 'vendor' && String(convo.vendorId) === userId
    if (!isClient && !isVendor) {
      return res.status(403).json({ success: false, error: 'Not allowed to view this conversation' })
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean()

    return res.json({
      success: true,
      conversation: {
        conversationId: convo.conversationId,
        status: convo.status,
        lastMessageAt: convo.lastMessageAt,
        summary: convo.summary || [],
      },
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
    })
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message })
  }
})

export default router



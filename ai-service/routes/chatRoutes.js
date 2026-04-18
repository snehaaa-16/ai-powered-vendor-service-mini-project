import express from 'express'
import geminiConnection from '../config/gemini.js'
import { Vendor } from '../models/index.js'
import IntentLog from '../models/IntentLog.js'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Minimal AI response endpoint using a prompt built from history
router.post('/respond', async (req, res) => {
  try {
    const { history = [], message, vendorId } = req.body || {}
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'message is required' })
    }

    // Fetch vendor details when vendorId is provided
    let vendor = null
    if (vendorId) {
      try {
        vendor = await Vendor.findById(vendorId).lean()
        if (!vendor) {
          return res.status(404).json({ success: false, error: 'Vendor not found' })
        }
      } catch (e) {
        return res.status(404).json({ success: false, error: 'Vendor not found' })
      }
    }

    const context = Array.isArray(history)
      ? history
          .slice(-10)
          .map(h => `${h.role || 'user'}: ${h.content || ''}`)
          .join('\n')
      : ''

    // Try to load vendor-specific training data (markdown or json)
    let trainingText = ''
    if (vendorId) {
      try {
        const dataDir = path.resolve(__dirname, '..', 'data', 'vendor-training')
        const vendorMd = path.join(dataDir, `${vendorId}.md`)
        const vendorJson = path.join(dataDir, `${vendorId}.json`)
        const defaultMd = path.join(dataDir, 'default.md')
        const defaultJson = path.join(dataDir, 'default.json')

        // Prefer vendor-specific files; fallback to defaults
        let content = null
        for (const p of [vendorMd, vendorJson, defaultMd, defaultJson]) {
          try {
            const stat = await fs.stat(p)
            if (stat.isFile()) {
              content = await fs.readFile(p, 'utf8')
              if (p.endsWith('.json')) {
                try {
                  const obj = JSON.parse(content)
                  // Flatten json into readable guidance text
                  content = Object.entries(obj)
                    .map(([k, v]) => `${k}:\n${typeof v === 'string' ? v : JSON.stringify(v, null, 2)}`)
                    .join('\n\n')
                } catch {}
              }
              break
            }
          } catch {}
        }
        if (content) trainingText = `\n\nVendor Training Data (authoritative):\n${content}`
      } catch {}
    }

    // Build vendor context
    const baseVendorContext = vendor ? (() => {
      const name = vendor.name || 'Unknown Vendor'
      const category = vendor.vendorType || 'Service Provider'
      const skills = Array.isArray(vendor.skills) ? vendor.skills.map(s => s.name).filter(Boolean) : []
      const years = (() => {
        if (!Array.isArray(vendor.skills)) return null
        const vals = vendor.skills.map(s => s.yearsOfExperience || 0)
        const max = Math.max(...vals, 0)
        return max || null
      })()
      const pricing = (() => {
        if (!Array.isArray(vendor.services) || vendor.services.length === 0) return 'N/A'
        const mins = vendor.services.map(s => s.minPrice || 0)
        const maxs = vendor.services.map(s => s.maxPrice || 0)
        const min = Math.min(...mins)
        const max = Math.max(...maxs)
        const currency = vendor.services[0]?.currency || 'INR'
        return `${currency} ${min} - ${max}`
      })()
      const rating = vendor.rating?.average != null ? `${vendor.rating.average} / 5` : 'Unrated'
      const description = vendor.profile?.bio || vendor.profile?.description || ''
      const location = vendor.location ? `${vendor.location.city || ''}, ${vendor.location.state || ''}, ${vendor.location.country || ''}`.replace(/(^,\s*|,\s*,)/g,'').trim() : ''

      return `You are an AI assistant representing the vendor '${name}'.
The vendor specializes in '${category}' and offers services including: ${skills.join(', ') || 'N/A'}.
They have ${years ?? 'several'} years of experience and usually charge around ${pricing}.
Maintain the vendor’s tone and professionalism when responding to users.
Always provide responses that align with this vendor’s expertise and offerings.
If a user asks something unrelated to the vendor’s services, politely redirect to relevant services.
Vendor rating: ${rating}.
${description ? `Vendor description: ${description}.` : ''}
${location ? `Location: ${location}.` : ''}`
    })() : 'You are a helpful vendor assistant.'

    const vendorContext = `${baseVendorContext}${trainingText}`

    // Final structured prompt combining vendor info, history and user message
    // Instruction: If scope, budget and timeline appear finalized, append a SINGLE XML block with agreement summary:
    // <AGREEMENT>{"summary":"...","budget":"...","timeline":"...","scope":"..."}</AGREEMENT>
    // Otherwise, do not include the block.
    const prompt = `${vendorContext}

Conversation so far:
${context}

User: ${message}
Assistant:

Note: If you believe the project scope, budget and timeline are finalized, append a single line XML block of the form <AGREEMENT>{JSON}</AGREEMENT> after your reply.`

    const raw = await geminiConnection.generateText(prompt)
    // Extract optional agreement block
    let agreementReady = false
    let agreement = null
    let reply = raw
    try {
      const m = raw.match(/<AGREEMENT>([\s\S]*?)<\/AGREEMENT>/)
      if (m && m[1]) {
        const jsonText = m[1].trim()
        agreement = JSON.parse(jsonText)
        agreementReady = true
        reply = raw.replace(m[0], '').trim()
        if (agreement && (!agreement.summary || agreement.summary === '')) {
          // Fallback summary from recent context + message
          const fallbackSummary = `Agreement drafted regarding: ${message.slice(0, 80)}${message.length > 80 ? '...' : ''}`
          agreement.summary = fallbackSummary
        }
      }
    } catch {}

    try {
      await IntentLog.create({ source: 'chat', sourceId: 'respond', rawText: message, parsed: { reply, agreement }, vendorName: vendor?.name })
    } catch {}
    return res.json({ success: true, reply, agreementReady, agreement })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
})

// Summarize a conversation into bullet points
router.post('/summarize', async (req, res) => {
  try {
    const { history = [], vendorId } = req.body || {}

    const context = Array.isArray(history)
      ? history.map(h => `${h.role || 'user'}: ${h.content || ''}`).join('\n')
      : ''

    const prompt = `Summarize the following conversation into 5 concise bullet points focusing on:
- Agreed scope/features
- Budget and pricing terms
- Timeline and milestones
- Responsibilities/next steps
- Any assumptions or constraints

Return ONLY a valid JSON array of strings, no extra text.

Conversation:
${context}`

    const text = await geminiConnection.generateText(prompt)
    let bullets = []
    try {
      bullets = JSON.parse(text)
      if (!Array.isArray(bullets)) bullets = []
    } catch {
      // Attempt to extract JSON array
      const m = text.match(/\[[\s\S]*\]/)
      if (m) {
        try { bullets = JSON.parse(m[0]) } catch { bullets = [] }
      }
    }
    return res.json({ success: true, bullets })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
})

export default router



import 'dotenv/config'
import { sendChatSummaryEmail, getMailerStatus } from './config/mailer.js'

async function main() {
  console.log('Mailer status:', getMailerStatus())
  const to = process.env.TEST_EMAIL || process.env.SMTP_USER

  if (!to) {
    console.error('❌ TEST_EMAIL or SMTP_USER not set in .env')
    return
  }

  try {
    await sendChatSummaryEmail({
      to,
      vendorName: process.env.TEST_VENDOR_NAME ,
      clientName: process.env.TEST_CLIENT_NAME,
      bullets: [
        'Test requirement: Build a demo project',
        'Tech stack: React + Node.js',
        'Budget: 50k INR',
        'Timeline: 2 months'
      ],
      history: [
        { role: 'user',      content: 'Hi, I need a small demo project.' },
        { role: 'assistant', content: 'Sure, here is what I can offer…' },
        { role: 'system',    content: 'This is only a test email.' }
      ]
    })

    console.log('✅ Test email sent')
  } catch (err) {
    console.error('❌ Failed to send test email:', err)
  }
}

main()
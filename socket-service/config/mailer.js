import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.warn('⚠️ SMTP not fully configured. Chat summary emails will be skipped.')
    return null
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  return transporter
}

export async function sendChatSummaryEmail({ to, vendorName, clientName, bullets = [], history = [], contactDetails = null }) {
  const t = getTransporter()
  if (!t) return

  const from = process.env.MAIL_FROM || process.env.SMTP_USER
  const subject = `New AI chat summary for ${vendorName || 'your profile'}`

  const bulletHtml =
    bullets && bullets.length
      ? `<ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
      : '<p>No structured summary available.</p>'

  const contactHtml = contactDetails
    ? `<p style="margin: 16px 0 8px 0;"><strong>Client contact details (as provided with consent):</strong><br>${contactDetails}</p>`
    : ''

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; color: #0f172a;">
      <h2 style="margin-bottom: 8px;">New AI Chat Summary</h2>
      <p style="margin: 0 0 12px 0;">Hi ${vendorName || 'there'},</p>
      <p style="margin: 0 0 12px 0;">
        Here is a summary of a recent conversation that a client had with your AI assistant${
          clientName ? ` (<strong>${clientName}</strong>)` : ''
        }.
      </p>
      <h3 style="margin: 16px 0 8px 0;">Key Requirements</h3>
      ${bulletHtml}
      ${contactHtml}
      <p style="margin-top: 16px; font-size: 12px; color: #64748b;">
        This email was generated automatically from your AI chat assistant.
      </p>
    </div>
  `

  await t.sendMail({ from, to, subject, html })
}

export function getMailerStatus() {
  const t = getTransporter()
  return {
    enabled: !!t,
  }
}



import { env } from './env'

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

export interface BrevoSendOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(opts: BrevoSendOptions): Promise<{ messageId: string }> {
  const sender = { name: 'Granger', email: env.BREVO_FROM_EMAIL }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender,
      to: [{ email: opts.to }],
      subject: opts.subject,
      htmlContent: opts.html,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    let parsed: unknown
    try { parsed = JSON.parse(text) } catch { parsed = text }
    throw new Error(`Brevo API error ${response.status}: ${typeof parsed === 'string' ? parsed : JSON.stringify(parsed)}`)
  }

  const data = (await response.json()) as { messageId?: string }
  return { messageId: data.messageId ?? '' }
}

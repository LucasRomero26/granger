import { sendEmail } from '../config/email'
import { env } from '../config/env'
import { logger } from '../config/logger'

interface IEmailParams {
  email: string
  name: string
  token: string
}

export class AuthEmail {
  static async sendConfirmationEmail({ email, name, token }: IEmailParams): Promise<void> {
    const confirmationUrl = `${env.FRONTEND_URL}/auth/confirm-account`

    const html = `
        <div style="font-family: 'Source Sans 3', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #7c3aed; font-size: 24px; margin: 0 0 16px;">Hi ${name},</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            You created an account on <strong>Granger</strong>. Almost there, you just need to confirm it.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Visit the following link and enter the verification code:
          </p>
          <p style="margin: 24px 0;">
            <a href="${confirmationUrl}" style="display: inline-block; background: #7c3aed; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
              Confirm account
            </a>
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Your verification code is: <strong style="font-size: 22px; letter-spacing: 4px; color: #7c3aed;">${token}</strong>
          </p>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 32px;">
            This code expires in 10 minutes. If you did not create this account, you can ignore this email.
          </p>
        </div>
      `

    try {
      const { messageId } = await sendEmail({ to: email, subject: 'Granger - Confirm your account', html })
      logger.info({ id: messageId, email }, 'Confirmation email sent')
    } catch (err) {
      logger.error({ err, email }, 'Failed to send confirmation email')
      throw err
    }
  }

  static async sendPasswordResetToken({ email, name, token }: IEmailParams): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/auth/new-password`

    const html = `
        <div style="font-family: 'Source Sans 3', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #7c3aed; font-size: 24px; margin: 0 0 16px;">Hi ${name},</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            You requested a password reset on <strong>Granger</strong>.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Visit the following link and enter the verification code:
          </p>
          <p style="margin: 24px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #7c3aed; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
              Reset password
            </a>
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Your verification code is: <strong style="font-size: 22px; letter-spacing: 4px; color: #7c3aed;">${token}</strong>
          </p>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 32px;">
            This code expires in 10 minutes. If you did not request this change, you can ignore this email.
          </p>
        </div>
      `

    try {
      const { messageId } = await sendEmail({ to: email, subject: 'Granger - Reset your password', html })
      logger.info({ id: messageId, email }, 'Password reset email sent')
    } catch (err) {
      logger.error({ err, email }, 'Failed to send password reset email')
      throw err
    }
  }
}

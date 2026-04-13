import nodemailer from 'nodemailer'

function hasSmtpConfig(env) {
  return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS)
}

export function createMailer(env) {
  if (!hasSmtpConfig(env)) {
    console.warn(
      '[SmartShop] SMTP not configured — OTP will be returned as devOtp in the API response.\n' +
        'Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in your environment to enable email delivery.'
    )
    return null
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: String(env.SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  })
}

export async function sendOtpEmail({ transporter, env, email, code }) {
  if (!transporter) {
    return { delivered: false }
  }

  await transporter.sendMail({
    from: env.SMTP_FROM || `"SmartShop" <${env.SMTP_USER}>`,
    to: email,
    subject: 'Your SmartShop OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #fff; border-radius: 12px; border: 1px solid #ececec;">
        <h2 style="margin: 0 0 8px 0; color: #1f1637; font-size: 22px;">SmartShop sign-in code</h2>
        <p style="margin: 0 0 24px 0; color: #555; font-size: 15px;">Use this one-time password to continue. It expires in <strong>10 minutes</strong>.</p>
        <div style="display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #d9466f; background: #fdf0f4; border-radius: 8px; padding: 16px 28px; margin-bottom: 24px;">${code}</div>
        <p style="margin: 0; color: #999; font-size: 13px;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `,
  })

  return { delivered: true }
}

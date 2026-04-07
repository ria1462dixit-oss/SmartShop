import nodemailer from 'nodemailer'

function hasSmtpConfig(env) {
  return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS)
}

export function createMailer(env) {
  if (!hasSmtpConfig(env)) {
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
    from: env.SMTP_FROM || env.SMTP_USER,
    to: email,
    subject: 'Your SmartShop OTP',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f1637;">
        <h2 style="margin-bottom: 8px;">SmartShop sign-in code</h2>
        <p style="margin-bottom: 18px;">Use this one-time password to continue:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 8px; margin-bottom: 18px;">${code}</div>
        <p style="margin: 0;">This code expires in 10 minutes.</p>
      </div>
    `,
  })

  return { delivered: true }
}

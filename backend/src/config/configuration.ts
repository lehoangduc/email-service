const configuration = () => ({
  api: {
    interface: process.env.API_INTERFACE || 'localhost',
    port: parseInt(process.env.API_PORT || '3000', 10),
  },
  mailer: {
    defaults: {
      from: process.env.MAIL_FROM,
    },
    ses: {
      host: process.env.SMTP_SES_HOST,
      port: parseInt(process.env.SMTP_SES_PORT || '465', 10),
      secure: process.env.SMTP_SES_SECURE === 'true',
      user: process.env.SMTP_SES_USER,
      password: process.env.SMTP_SES_PASSWORD,
    },
    mailjet: {
      host: process.env.SMTP_MAILJET_HOST,
      port: parseInt(process.env.SMTP_MAILJET_PORT || '465', 10),
      secure: process.env.SMTP_MAILJET_SECURE === 'true',
      user: process.env.SMTP_MAILJET_USER,
      password: process.env.SMTP_MAILJET_PASSWORD,
    },
  },
})

export { configuration }

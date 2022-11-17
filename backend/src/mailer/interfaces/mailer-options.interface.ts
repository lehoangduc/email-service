import * as SMTPTransport from 'nodemailer/lib/smtp-transport'

export type TransportType = SMTPTransport

export interface MailerOptions {
  defaults?: SMTPTransport.Options
  transports: {
    [name: string]: SMTPTransport | SMTPTransport.Options | string
  }
}

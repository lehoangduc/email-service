import { Test, TestingModule } from '@nestjs/testing'
import * as SMTPTransport from 'nodemailer/lib/smtp-transport'
import * as nodemailerMock from 'nodemailer-mock'
import MailMessage from 'nodemailer/lib/mailer/mail-message'

import { MAILER_OPTIONS } from './constants/mailer.constant'
import { MailerOptions } from './interfaces/mailer-options.interface'
import { MailerService } from './mailer.service'
import { getLoggerToken } from 'nestjs-pino'

const transports = {
  ses: {
    host: 'smtp.domain.com',
    port: 465,
    secure: true,
    auth: {
      user: 'user@domain.com',
      pass: 'pass',
    },
  },
  mailjet: {
    host: 'smtp.domain.com',
    port: 465,
    secure: true,
    auth: {
      user: 'user@domain.com',
      pass: 'pass',
    },
  },
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('MailerService', () => {
  it('should not be defined if transports is not provided', async () => {
    await expect(getMailerService({ transports: {} })).rejects.toMatchInlineSnapshot(
      '[Error: Please provide mail transports]'
    )
  })

  it('should accept smtp transports options', async () => {
    const service = await getMailerService({
      transports,
    })

    expect(service).toBeDefined()
    expect((service as any).transporters).toBeInstanceOf(Map)
  })

  it('should send email with nodemailer', async () => {
    let lastMail: MailMessage
    const send = spyOnSmtpSend((mail: MailMessage) => {
      lastMail = mail
    })

    const service = await getMailerService({
      transports,
    })

    await service.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.TEST_MAIL_TO,
      subject: process.env.TEST_MAIL_SUBJECT,
      html: process.env.TEST_MAIL_HTML,
    })

    expect(send).toBeCalledTimes(1)
    expect(lastMail.data.from).toBe(process.env.MAIL_FROM)
    expect(lastMail.data.to).toBe(process.env.TEST_MAIL_TO)
    expect(lastMail.data.subject).toBe(process.env.TEST_MAIL_SUBJECT)
    expect(lastMail.data.html).toBe(process.env.TEST_MAIL_HTML)
  })

  it('should throw error with invalid transpoters', async () => {
    let lastMail: MailMessage
    const send = spyOnSmtpSendError((mail: MailMessage) => {
      lastMail = mail
    })

    const service = await getMailerService({
      transports,
    })

    await expect(() => {
      return service.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.TEST_MAIL_TO,
        subject: process.env.TEST_MAIL_SUBJECT,
        html: process.env.TEST_MAIL_HTML,
      })
    }).rejects.toThrowError('Cannot send email')

    expect(send).toBeCalledTimes(2)
    expect((service as any).logger.error).toBeCalledTimes(2)
  })

  it('should failover to a different transport', async () => {
    let lastMail: MailMessage

    const customTransporter = nodemailerMock.createTransport({ host: 'localhost', port: 465 })
    const sendError = spyOnSmtpSendError((mail: MailMessage) => {
      lastMail = mail
    }, customTransporter)
    const send = spyOnSmtpSend((mail: MailMessage) => {
      lastMail = mail
    })

    const service = await getMailerService({
      transports: { custom: customTransporter, ...transports },
    })

    await service.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.TEST_MAIL_TO,
      subject: process.env.TEST_MAIL_SUBJECT,
      html: process.env.TEST_MAIL_HTML,
    })

    expect(sendError).toBeCalledTimes(1)
    expect(send).toBeCalledTimes(1)

    expect(lastMail.data.from).toBe(process.env.MAIL_FROM)
    expect(lastMail.data.to).toBe(process.env.TEST_MAIL_TO)
    expect(lastMail.data.subject).toBe(process.env.TEST_MAIL_SUBJECT)
    expect(lastMail.data.html).toBe(process.env.TEST_MAIL_HTML)
  })
})

function getLoggerMock() {
  const fakePino = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }

  return fakePino
}

async function getMailerService(options: MailerOptions): Promise<MailerService> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        name: MAILER_OPTIONS,
        provide: MAILER_OPTIONS,
        useValue: options,
      },
      {
        provide: getLoggerToken(MailerService.name),
        useValue: getLoggerMock(),
      },
      MailerService,
    ],
  }).compile()

  const service = module.get<MailerService>(MailerService)
  return service
}

function spyOnSmtpSend(onMail: (mail: MailMessage) => void) {
  return jest
    .spyOn(SMTPTransport.prototype, 'send')
    .mockImplementation(function (
      mail: MailMessage,
      callback: (err: Error | null, info: SMTPTransport.SentMessageInfo) => void
    ): void {
      onMail(mail)
      callback(null, {
        envelope: {
          from: mail.data.from as string,
          to: [mail.data.to as string],
        },
        messageId: 'MESSAGEID',
        accepted: [],
        rejected: [],
        pending: [],
        response: 'ok',
      })
    })
}

function spyOnSmtpSendError(
  onMail: (mail: MailMessage) => void,
  transport?: nodemailerMock.Transporter
) {
  return jest
    .spyOn(transport?.prototype || SMTPTransport.prototype, 'send')
    .mockImplementation(function (
      mail: MailMessage,
      callback: (err: Error | null, info: SMTPTransport.SentMessageInfo) => void
    ): void {
      onMail(mail)
      callback(new Error('Cannot send email'), null)
    })
}

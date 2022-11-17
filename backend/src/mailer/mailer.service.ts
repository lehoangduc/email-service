import { Injectable, Inject, Optional } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { SentMessageInfo, Transporter } from 'nodemailer'

import { MAILER_OPTIONS } from './constants/mailer.constant'
import { MailerTransportFactory as IMailerTransportFactory } from './interfaces/mailer-transport-factory.interface'
import { MailerOptions } from './interfaces/mailer-options.interface'
import { SendMailOptions } from './interfaces/send-mail-options.interface'
import { MailerTransportFactory } from './mailer-transport.factory'

@Injectable()
export class MailerService {
  private transporters = new Map<string, Transporter>()

  constructor(
    @InjectPinoLogger(MailerService.name)
    private readonly logger: PinoLogger,
    @Inject(MAILER_OPTIONS) private readonly mailerOptions: MailerOptions,
    @Optional()
    private readonly transportFactory: IMailerTransportFactory
  ) {
    this.transportFactory = new MailerTransportFactory(mailerOptions)

    if (!mailerOptions.transports || Object.keys(mailerOptions.transports).length <= 0) {
      throw new Error('Please provide mail transports')
    }

    Object.keys(mailerOptions.transports).forEach((name) => {
      this.transporters.set(
        name,
        this.transportFactory.createTransport(mailerOptions.transports[name])
      )
    })
  }

  public async sendMail(sendMailOptions: SendMailOptions): Promise<SentMessageInfo> {
    // use a specific transporter
    if (sendMailOptions.transporterName && this.transporters.get(sendMailOptions.transporterName)) {
      return this.transporters.get(sendMailOptions.transporterName).sendMail(sendMailOptions)
    }

    // try all transporters
    for (const [, transporter] of this.transporters) {
      try {
        const res = await transporter.sendMail(sendMailOptions)
        return res
      } catch (err) {
        this.logger.error(err)
      }
    }

    throw new Error('Cannot send email')
  }
}

import { Inject } from '@nestjs/common'
import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

import { MailerTransportFactory as IMailerTransportFactory } from './interfaces/mailer-transport-factory.interface'
import { MailerOptions, TransportType } from './interfaces/mailer-options.interface'
import { MAILER_OPTIONS } from './constants/mailer.constant'

export class MailerTransportFactory implements IMailerTransportFactory {
  constructor(
    @Inject(MAILER_OPTIONS)
    private readonly options: MailerOptions
  ) {}

  public createTransport(opts: TransportType): Mail {
    return createTransport(opts, this.options.defaults)
  }
}

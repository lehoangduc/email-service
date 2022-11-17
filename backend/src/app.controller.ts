import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { SendMailDto } from './dtos/send-mail.dto'
import { MailerService } from './mailer'

@Controller()
export class AppController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('mail')
  @HttpCode(204)
  async sendMail(@Body() data: SendMailDto) {
    await this.mailerService.sendMail(data)
  }
}

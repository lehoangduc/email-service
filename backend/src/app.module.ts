import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { configuration } from './config/configuration'
import { AppController } from './app.controller'
import { MailerModule } from './mailer'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'warn',
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
      },
    }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transports: {
          mailjet: {
            host: config.get('mailer.mailjet.host'),
            port: config.get('mailer.mailjet.port'),
            secure: config.get('mailer.mailjet.secure'),
            auth: {
              user: config.get('mailer.mailjet.user'),
              pass: config.get('mailer.mailjet.password'),
            },
          },
          ses: {
            host: config.get('mailer.ses.host'),
            port: config.get('mailer.ses.port'),
            secure: config.get('mailer.ses.secure'),
            auth: {
              user: config.get('mailer.ses.user'),
              pass: config.get('mailer.ses.password'),
            },
          },
        },
        defaults: config.get('mailer.defaults'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

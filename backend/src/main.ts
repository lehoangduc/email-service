import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'

async function bootstrap() {
  const app: any = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    cors: true,
  })
  const config = app.get(ConfigService)
  const logger = app.get(Logger)
  const listenInterface = config.get('api.interface')
  const listenPort = config.get('api.port')

  app.useLogger(logger)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  await app.listen(listenPort, listenInterface)

  logger.log(`Server is listening at ${listenInterface}:${listenPort}`)
}

bootstrap()

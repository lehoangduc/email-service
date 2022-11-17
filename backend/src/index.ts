import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { configure as serverlessExpress } from '@vendia/serverless-express'
import { Callback, Context, Handler } from 'aws-lambda'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'

let server: Handler

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, cors: true })

  const logger = app.get(Logger)
  app.useLogger(logger)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  await app.init()

  const expressApp = app.getHttpAdapter().getInstance()
  return serverlessExpress({ app: expressApp })
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap())
  return server(event, context, callback)
}

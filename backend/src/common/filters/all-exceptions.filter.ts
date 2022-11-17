import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const error = exception instanceof HttpException ? exception.getResponse() : exception
    const status = this.getStatus(exception, error)

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception)
      return response.status(status).send({
        errors: [{ message: 'An unexpected error has occurred' }],
      })
    }

    response.status(status).send({
      errors: this.getErrorMessages(error),
    })
  }

  getStatus(exception: any, error: any) {
    if (exception instanceof HttpException) return exception.getStatus()

    if (error.http_status) return error.http_status

    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  getErrorMessages(error: any) {
    if (typeof error === 'string' || error instanceof String) return [error]

    if (Array.isArray(error.message)) {
      return error.message.map((m: string) => ({
        message: m,
      }))
    }

    return [{ message: error.message }]
  }
}

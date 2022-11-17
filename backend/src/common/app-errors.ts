import { HttpStatus } from '@nestjs/common'

import { DomainError } from './domain-error'

export namespace AppErrors {
    export class UnexpectedError extends DomainError {
    public static create(error: Error, meta?: any): UnexpectedError {
      const err = new UnexpectedError(
        'An unexpected error occurred',
        meta,
        HttpStatus.INTERNAL_SERVER_ERROR
      )

      err.stack = error.stack

      return err
    }
  }
}

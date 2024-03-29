import { Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DuplicateFieldError } from '../errors/duplicate-field.error';

@Catch(DuplicateFieldError)
export class QueryErrorFilter extends BaseExceptionFilter {
  public catch(exception: any, host: ArgumentsHost): void {
    console.log('Dummy QueryErrorFilter', exception);
    const detail = exception.message;
    if (typeof detail === 'string' && detail.includes('already exists.')) {
      exception = new BadRequestException(detail);
    }
    return super.catch(exception, host);
  }
}

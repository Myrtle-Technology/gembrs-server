import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function PaginateQueryOptions() {
  return applyDecorators(
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'next', required: false, type: 'string' }),
    ApiQuery({ name: 'previous', required: false, type: 'string' }),
    ApiQuery({
      name: 'fields',
      required: false,
      explode: true,
      isArray: true,
      type: 'string',
      style: 'simple',
    }),
    ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] }),
  );
}

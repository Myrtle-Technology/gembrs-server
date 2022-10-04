import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function CursorPaginateQueryOptions() {
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
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      explode: true,
      isArray: true,
      type: 'string',
    }),
    ApiQuery({
      name: 'include',
      required: false,
      explode: true,
      isArray: true,
      type: 'string',
    }),
  );
}

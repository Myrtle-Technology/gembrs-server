import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function CursorPaginateQueryOptions() {
  return applyDecorators(
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'nextCursor', required: false, type: 'string' }),
    ApiQuery({ name: 'previousCursor', required: false, type: 'string' }),
    ApiQuery({
      name: 'fields',
      required: false,
      explode: true,
      isArray: true,
      type: 'string',
      description:
        'Fields to include in the response (by default returns all fields)',
    }),
    ApiQuery({
      name: 'sort',
      type: 'string',
      required: false,
      description:
        'it must be a space delimited list of path names. The sort order of each path is ascending unless the path name is prefixed with - which will be treated as descending.',
      example: 'role.name -user.name',
    }),
    ApiQuery({
      name: 'include',
      required: false,
      explode: true,
      isArray: true,
      type: 'string',
      description: 'Relations to include in the response',
    }),
  );
}

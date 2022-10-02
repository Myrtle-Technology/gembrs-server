import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { pickBy, Dictionary, isString, mapKeys } from 'lodash';
import { PaginationResult } from '../shared.repository';

export interface PaginateQuery {
  page?: number;
  limit?: number;
  sortBy?: [string, string][];
  searchBy?: string[];
  search?: string;
  filter?: { [column: string]: string | string[] };
  path: string;
}

export const Paginate = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const { query } = request;

    const fields = Object.fromEntries(
      (query.fields as string[]).map((field) => {
        return [field, 1];
      }),
    );

    console.log(query.fields, fields);
    return {
      fields: fields,
      limit: +query.limit,
      sortAscending: query.sort === 'asc',
      next: query.next,
      previous: query.previous,
    };
  },
);

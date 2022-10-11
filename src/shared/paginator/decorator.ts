import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { pickBy, Dictionary, isString, mapKeys } from 'lodash';
import { PaginationOptions, PaginationResult } from '../shared.repository';

export interface PaginateQuery {
  page?: number;
  limit?: number;
  sortBy?: [string, string][];
  searchBy?: string[];
  search?: string;
  filter?: { [column: string]: string | string[] };
  path: string;
}

export const CursorPaginateQuery = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const { query } = request;
    console.log(query.sort);
    const _query: PaginationOptions<any> = {
      select: query.fields ? (query.fields as string[]) : [],
      limit: +query.limit,
      sort: query.sort as string,
      startingAfter: query.cursor as string,
      // endingBefore: query.previous,
      populate: query.include ? (query.include as string[]) : [],
    };
    return _query;
  },
);

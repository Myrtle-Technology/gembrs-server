import {
  FilterQuery,
  Model,
  ObjectId,
  ProjectionType,
  QueryOptions,
  SaveOptions,
  SortOrder,
} from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedRepository<
  Entity,
  CreateDto = Entity,
  UpdateDto = CreateDto,
> {
  constructor(readonly model: Model<Entity>) {}

  protected populateOnFind: string[] = [];

  public async find(
    filter: FilterQuery<Entity> = {},
    projection?: ProjectionType<Entity>,
    options?: QueryOptions<Entity>,
  ): Promise<Entity[]> {
    return this.model
      .find(filter, projection, options)
      .populate(this.populateOnFind)
      .exec();
  }

  public async findById(id: ObjectId | any, options?: QueryOptions<Entity>) {
    return (
      this.model
        .findById(
          id,
          {},
          {
            populate: this.populateOnFind,
            ...options,
          },
        )
        // .populate(this.populateOnFind)
        .exec()
    );
  }

  public async findOne(
    filter?: FilterQuery<Entity>,
    projection?: ProjectionType<Entity> | null,
    options?: QueryOptions<Entity> | null,
  ) {
    return (
      this.model
        .findOne(filter, projection, {
          populate: this.populateOnFind,
          ...options,
        })
        // .populate(this.populateOnFind)
        .exec()
    );
  }

  public async create(dto: CreateDto, options?: SaveOptions) {
    const createdUser = new this.model(dto);
    return createdUser.save(options);
  }

  public async updateById(
    id: ObjectId | any,
    dto: UpdateDto,
    options?: QueryOptions<Entity>,
  ): Promise<Entity> {
    return this.model.findByIdAndUpdate(id, dto, {
      new: true,
      ...options,
      populate: this.populateOnFind,
    });
  }

  public async updateOne(
    filter: FilterQuery<Entity>,
    dto: UpdateDto,
    options?: QueryOptions<Entity>,
  ): Promise<Entity> {
    return this.model.findOneAndUpdate(filter, dto, {
      new: true,
      ...options,
      populate: this.populateOnFind,
    });
  }

  public async deleteById(id?: ObjectId | any, options?: QueryOptions<Entity>) {
    return this.model.findByIdAndRemove(id, options);
  }

  public async deleteOne(
    filter: FilterQuery<Entity>,
    options?: QueryOptions<Entity>,
  ) {
    return this.model.findOneAndRemove(filter, options);
  }

  public async paginate(
    params: PaginationOptions<Entity>,
  ): Promise<PaginationResult<Entity>> {
    const result: InternalPaginationResult<Entity> = await (
      this.model as any
    ).paginate(params);
    return {
      data: result.results,
      meta: {
        next: result.next,
        previous: result.previous,
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious,
      },
    };
  }
  public async search(
    params: PaginationOptions<Entity>,
  ): Promise<PaginationResult<Entity>> {
    const result: InternalPaginationResult<Entity> = await (
      this.model as any
    ).search(params);
    return {
      data: result.results,
      meta: {
        next: result.next,
        previous: result.previous,
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious,
      },
    };
  }

  public async paginateSlow({
    defaultFilter,
    filter,
    select,
    options,
    sort,
    limit = 20,
    page = 1,
  }: SlowPaginationOptions<Entity>): Promise<SlowPaginationResult<Entity>> {
    const data = await this.model
      .find({ ...defaultFilter, ...filter }, select, options)
      .populate(this.populateOnFind)
      .sort(sort)
      .limit(limit)
      .skip(limit * page)
      .exec();
    const count = await this.model.countDocuments(defaultFilter).exec();
    return {
      data,
      pagination: {
        limit,
        page,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  public async upsert(id: ObjectId | any, dto: any): Promise<Entity> {
    throw new Error('Method not implemented.');
  }
  public async aggregate(options?: any): Promise<Entity> {
    throw new Error('Method not implemented.');
  }
}

/*
 @param {Object} params
      -query {Object} The find query.
      -limit {Number} The page size. Must be between 1 and `config.MAX_LIMIT`.
      -fields {Object} Fields to query in the Mongo object format, e.g. {_id: 1, timestamp :1}.
        The default is to query all fields.
      -paginatedField {String} The field name to query the range for. The field must be:
          1. Orderable. We must sort by this value. If duplicate values for paginatedField field
            exist, the results will be secondarily ordered by the _id.
          2. Indexed. For large collections, this should be indexed for query performance.
          3. Immutable. If the value changes between paged queries, it could appear twice.
          4. Consistent. All values (except undefined and null values) must be of the same type.
        The default is to use the Mongo built-in '_id' field, which satisfies the above criteria.
        The only reason to NOT use the Mongo _id field is if you chose to implement your own ids.
      -sortAscending {Boolean} True to sort using paginatedField ascending (default is false - descending).
      -sortCaseInsensitive {boolean} Whether to ignore case when sorting, in which case `paginatedField`
        must be a string property.
      -next {String} The value to start querying the page.
      -previous {String} The value to start querying previous page.
 */
export interface PaginationOptions<Entity> {
  query?: FilterQuery<Entity>;
  limit?: number;
  fields?: Record<keyof Entity, 1 | 0>;
  sortAscending?: boolean;
  next?: string;
  previous?: string;
}
export interface InternalPaginationResult<Entity> {
  previous: string;
  hasPrevious: boolean;
  next: string;
  hasNext: boolean;
  results: Entity[];
}
export interface PaginationResult<Entity> {
  meta: {
    previous: string;
    hasPrevious: boolean;
    next: string;
    hasNext: boolean;
  };
  data: Entity[];
}

export interface SlowPaginationOptions<Entity> {
  limit?: number;
  page?: number;
  sort:
    | string
    | {
        [key: string]:
          | SortOrder
          | {
              $meta: 'textScore';
            };
      };
  defaultFilter?: FilterQuery<Entity>;
  filter?: FilterQuery<Entity>;
  select?: ProjectionType<Entity> | null;
  options?: QueryOptions<Entity> | null;
  search?: string;
}

export interface SlowPaginationResult<Entity> {
  pagination: {
    total: number;
    limit: number;
    page: number;
    pages: number;
  };
  data: Entity[];
}

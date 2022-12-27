import {
  FilterQuery,
  InsertManyOptions,
  Model,
  ObjectId,
  ProjectionType,
  QueryOptions,
  SaveOptions,
  SortOrder,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  Pagination,
  PaginationModel,
  PaginationOptions as MPaginationOptions,
} from 'mongoose-paginate-ts';
import { result, uniq } from 'lodash';

@Injectable()
export class SharedRepository<
  Entity,
  CreateDto = Entity,
  UpdateDto = CreateDto,
> {
  constructor(readonly model: Model<Entity>) {}

  protected populateOnFind: string[] = [];
  protected excludedFields: string[] = [];
  protected defaults: {
    filter: FilterQuery<Entity>;
    projection: ProjectionType<Entity>;
    options: QueryOptions<Entity>;
  };

  public scope(
    filter: FilterQuery<Entity> = {},
    projection?: ProjectionType<Entity>,
    options?: QueryOptions<Entity>,
  ) {
    this.defaults = { filter, projection, options };
    return this;
  }

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

  public async findById(
    id: ObjectId | any,
    options?: QueryOptions<Entity>,
  ): Promise<Entity> {
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
  ): Promise<Entity> {
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

  public async createMany(dto: CreateDto[], options?: InsertManyOptions) {
    return this.model.insertMany(dto, options);
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
    params.select = this.getSelect(params.select);
    params.populate = uniq([...this.populateOnFind, ...params.populate]);
    const { docs, ...meta } = await (this.model as Pagination<Entity>).paginate(
      params,
    );
    return {
      data: docs,
      meta,
    };
  }

  protected getSelect(_select: string | string[]): string[] {
    if (!_select) return [];
    const select = Array.isArray(_select) ? _select : [_select];
    return select.filter((s) => !this.excludedFields.includes(s));
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
export interface PaginationOptions<Entity> extends MPaginationOptions {
  query?: FilterQuery<Entity>;
  limit?: number;
  select?: string | string[];
  sort?:
    | string
    | {
        [key: string]:
          | SortOrder
          | {
              $meta: 'textScore';
            };
      };
  key?: string;
  aggregate?: any;
  populate?: string[];
  projection?: any;
  forceCountFunction?: boolean;
  lean?: boolean;
  startingAfter?: any;
  endingBefore?: any;
  page?: number;
}
export type InternalPaginationResult<Entity> = PaginationModel<Entity>;
export interface PaginationResult<Entity> {
  meta: Omit<InternalPaginationResult<Entity>, 'docs'>;
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

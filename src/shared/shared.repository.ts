import {
  FilterQuery,
  HydratedDocument,
  Model,
  ObjectId,
  ProjectionType,
  QueryOptions,
  SaveOptions,
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

  public async upsert(id: ObjectId | any, dto: any): Promise<Entity> {
    throw new Error('Method not implemented.');
  }
  public async aggregatePaginate(options?: any): Promise<[Entity[], number]> {
    throw new Error('Method not implemented.');
  }
  public async aggregate(options?: any): Promise<Entity> {
    throw new Error('Method not implemented.');
  }
}

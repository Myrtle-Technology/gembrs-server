import {
  AnyObject,
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
  public async find(
    options?: any,
  ): Promise<
    HydratedDocument<Entity, Record<string, unknown>, Record<string, unknown>>[]
  > {
    return this.model.find(options).exec();
  }

  public async findById(id: ObjectId | any, options?: QueryOptions<Entity>) {
    return this.model.findById(id, {}, options).exec();
  }

  public async findOne(
    filter?: FilterQuery<Entity>,
    projection?: ProjectionType<Entity> | null,
    options?: QueryOptions<Entity> | null,
  ) {
    return this.model.findOne(filter, projection, options).exec();
  }

  public async create(dto: CreateDto, options?: SaveOptions) {
    const createdUser = new this.model(dto);
    return createdUser.save(options);
  }

  public async update(
    id: ObjectId | any,
    dto: UpdateDto,
    options?: QueryOptions<Entity>,
  ): Promise<Entity> {
    return this.model.findByIdAndUpdate(id, dto, {
      new: true,
      ...options,
    });
  }

  public async delete(id?: ObjectId | any, options?: QueryOptions<Entity>) {
    return this.model.findByIdAndRemove(id, options);
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

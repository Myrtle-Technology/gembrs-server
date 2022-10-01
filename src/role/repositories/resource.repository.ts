import { SharedRepository } from 'src/shared/shared.repository';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { UpdateResourceDto } from '../dto/update-resource.dto';
import { Resource } from '../schemas/resource.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Role } from 'src/role/schemas/role.schema';

@Injectable()
export class ResourceRepository extends SharedRepository<
  Resource,
  CreateResourceDto,
  UpdateResourceDto
> {
  constructor(@InjectModel(Resource.name) model: Model<Resource>) {
    super(model);
  }

  populateOnFind = ['resourceRoles'];

  public async findOrCreate(dto: CreateResourceDto) {
    const resource = await this.model.findOneAndUpdate(
      { slug: dto.slug },
      dto,
      {
        upsert: true,
        new: true,
      },
    );
    if (!resource) {
      return { resource: await this.create(dto), created: true };
    }
    return { resource, created: false };
  }

  findBySlug(slug: string) {
    return this.model
      .findOne({ slug: slug })
      .populate(this.populateOnFind)
      .exec();
  }

  public async findOne(
    filter?: FilterQuery<Role>,
    projection?: ProjectionType<Role> | null,
    options?: QueryOptions<Role> | null,
  ) {
    return this.model
      .findOne(filter, projection, {
        ...options,
      })
      .populate(this.populateOnFind)
      .exec();
  }
}

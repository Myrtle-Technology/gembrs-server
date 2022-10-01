import { SharedRepository } from 'src/shared/shared.repository';
import { CreateResourceRoleDto } from './dto/create-resource-role.dto';
import { UpdateResourceRoleDto } from './dto/update-resource-role.dto';
import { ResourceRole } from './schemas/resource-role.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Role } from 'src/role/schemas/role.schema';

@Injectable()
export class ResourceRoleRepository extends SharedRepository<
  ResourceRole,
  CreateResourceRoleDto,
  UpdateResourceRoleDto
> {
  constructor(@InjectModel(ResourceRole.name) model: Model<ResourceRole>) {
    super(model);
  }

  populateOnFind = ['resource', 'role'];

  public async findOrCreate(dto: CreateResourceRoleDto) {
    const resource = await this.model.findOneAndUpdate(
      { role: dto.role, resource: dto.resource },
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

  findAllByRole(role: string) {
    return this.model.findOne({ role }).populate(this.populateOnFind).exec();
  }

  findAllByResource(resource: string) {
    return this.model
      .findOne({ resource })
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

import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { FilterQuery, ObjectId } from 'mongoose';
import slugify from 'slugify';
import { SharedService } from 'src/shared/shared.service';
import { CreateResourceRoleDto } from './dto/create-resource-role.dto';
import { UpdateResourceRoleDto } from './dto/update-resource-role.dto';
import { ResourceRoleRepository } from './resource-role.repository';
import { ResourceRole } from './schemas/resource-role.schema';

@Injectable()
export class ResourceRoleService
  extends SharedService<ResourceRoleRepository>
  implements OnModuleInit
{
  constructor(readonly repo: ResourceRoleRepository) {
    super(repo);
  }

  onModuleInit() {
    //
  }

  public async findOrCreate(dto: CreateResourceRoleDto) {
    return this.repo.findOrCreate(dto);
  }

  public async findAllByRole(role: string) {
    return this.repo.findAllByRole(role);
  }

  public async findAllByResource(role: string) {
    return this.repo.findAllByResource(role);
  }

  public async findAll(filter?: any) {
    return this.repo.find();
  }

  public async findOne(filter: FilterQuery<ResourceRole>) {
    return this.repo.findOne(filter);
  }

  public async findById(id: ObjectId | string) {
    return this.repo.findById(id);
  }

  public async update(id: ObjectId | string, dto: UpdateResourceRoleDto) {
    return this.repo.updateById(id, dto);
  }

  public async remove(id: ObjectId | string) {
    return this.repo.deleteById(id);
  }
}

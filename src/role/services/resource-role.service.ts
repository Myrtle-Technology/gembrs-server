import { Injectable, OnModuleInit } from '@nestjs/common';
import { uniq } from 'lodash';
import { FilterQuery, ObjectId } from 'mongoose';
import { SharedService } from 'src/shared/shared.service';
import { CreateResourceRoleDto } from '../dto/create-resource-role.dto';
import { UpdateResourceRoleDto } from '../dto/update-resource-role.dto';
import { Permission } from '../enums/permission.enum';
import { ResourceRoleRepository } from '../repositories/resource-role.repository';
import { ResourceService } from './resource.service';
import { rolesBuilder } from '../role.builder';
import { RoleService } from './role.service';
import { ResourceRole } from '../schemas/resource-role.schema';

@Injectable()
export class ResourceRoleService
  extends SharedService<ResourceRoleRepository>
  implements OnModuleInit
{
  constructor(
    readonly repo: ResourceRoleRepository,
    readonly roleService: RoleService,
    readonly resourceService: ResourceService,
  ) {
    super(repo);
  }

  public async onModuleInit() {
    const hashMapOfGrants = rolesBuilder.getGrants();
    const roles = await this.roleService.findDefaultRoles();
    const resources = await this.resourceService.findAll();

    roles.map((role) => {
      if (!hashMapOfGrants[role.slug]) return;
      resources.map(async (resource) => {
        if (['admin', 'member'].includes(role.slug)) {
          const permissions = uniq(
            Object.keys(
              hashMapOfGrants[role.slug][resource.slug] ?? {},
            ) as Permission[],
          );
          await this.findOrCreate({
            role: role._id,
            resource: resource._id,
            permissions,
          });
          // console.log('hashMapOfGrants', role.slug, resource.slug, permissions);
        }
      });
    });
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
  public async findAllByRoleAndResource(role: string, resource: string) {
    return this.repo.findAllByRoleAndResource(role, resource);
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

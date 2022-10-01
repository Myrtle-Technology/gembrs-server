import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import { ResourceController } from './resource.controller';
import { ResourceRepository } from './resource.repository';
import { ResourceService } from './resource.service';
import {
  ResourceRole,
  ResourceRoleSchema,
} from './schemas/resource-role.schema';
import { Resource, ResourceSchema } from './schemas/resource.schema';
import { ResourceRoleController } from './resource-role.controller';
import { ResourceRoleRepository } from './resource-role.repository';
import { ResourceRoleService } from './resource-role.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
      { name: ResourceRole.name, schema: ResourceRoleSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [RoleController, ResourceController, ResourceRoleController],
  providers: [
    RoleService,
    RoleRepository,
    ResourceService,
    ResourceRepository,
    ResourceRoleService,
    ResourceRoleRepository,
  ],
  exports: [
    RoleService,
    RoleRepository,
    ResourceService,
    ResourceRepository,
    ResourceRoleService,
    ResourceRoleRepository,
  ],
})
export class RoleModule {}

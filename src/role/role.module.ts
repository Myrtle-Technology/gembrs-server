import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { RoleRepository } from './repositories/role.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import { ResourceController } from './controllers/resource.controller';
import { ResourceRepository } from './repositories/resource.repository';
import { ResourceService } from './services/resource.service';
import {
  ResourceRole,
  ResourceRoleSchema,
} from './schemas/resource-role.schema';
import { Resource, ResourceSchema } from './schemas/resource.schema';
import { ResourceRoleController } from './controllers/resource-role.controller';
import { ResourceRoleRepository } from './repositories/resource-role.repository';
import { ResourceRoleService } from './services/resource-role.service';

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

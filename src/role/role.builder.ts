import { uniq } from 'lodash';
import { RolesBuilder } from 'nest-access-control';
import { Permission } from './enums/permission.enum';
import { ResourcesEnum } from './enums/resources.enum';
import { RoleEnum } from './enums/role.enum';
import { ResourceRoleService } from './services/resource-role.service';
import { ResourceService } from './services/resource.service';
import { RoleService } from './services/role.service';

export const rolesBuilder: RolesBuilder = new RolesBuilder();

/** Members */
rolesBuilder
  .grant(RoleEnum.Member)
  .readOwn(ResourcesEnum.User)
  .deleteOwn(ResourcesEnum.User)
  .updateOwn(ResourcesEnum.User)
  .readOwn(ResourcesEnum.Member)
  .deleteOwn(ResourcesEnum.Member)
  .updateOwn(ResourcesEnum.Member)
  .readAny(ResourcesEnum.Level)
  .readAny(ResourcesEnum.Organization);

/** Admin */
rolesBuilder
  .grant(RoleEnum.Admin)
  // .extend(RoleEnum.Member) replaced with block
  .readOwn(ResourcesEnum.User)
  .createOwn(ResourcesEnum.User)
  .deleteOwn(ResourcesEnum.User)
  .updateOwn(ResourcesEnum.User)
  .readAny(ResourcesEnum.Level)
  // members
  .readOwn(ResourcesEnum.Member)
  .updateOwn(ResourcesEnum.Member)
  .createOwn(ResourcesEnum.Member)
  .deleteOwn(ResourcesEnum.Member)
  // organizations
  .readOwn(ResourcesEnum.Organization)
  .updateOwn(ResourcesEnum.Organization)
  .createOwn(ResourcesEnum.Organization)
  .deleteOwn(ResourcesEnum.Organization)
  // membership plans
  .readOwn(ResourcesEnum.Level)
  .updateOwn(ResourcesEnum.Level)
  .createOwn(ResourcesEnum.Level)
  .deleteOwn(ResourcesEnum.Level)
  // membership plans
  .readOwn(ResourcesEnum.Email)
  .updateOwn(ResourcesEnum.Email)
  .createOwn(ResourcesEnum.Email)
  .deleteOwn(ResourcesEnum.Email)
  // SMS
  .readOwn(ResourcesEnum.Sms)
  .updateOwn(ResourcesEnum.Sms)
  .createOwn(ResourcesEnum.Sms)
  .deleteOwn(ResourcesEnum.Sms)
  // subscriptions
  .readOwn(ResourcesEnum.Subscription)
  .updateOwn(ResourcesEnum.Subscription)
  .createOwn(ResourcesEnum.Subscription)
  .deleteOwn(ResourcesEnum.Subscription);

export async function RolesBuilderFactory(
  roleService: RoleService,
  resourceService: ResourceService,
  resourceRoleService: ResourceRoleService,
): Promise<RolesBuilder> {
  const hashMapOfGrants = rolesBuilder.getGrants();
  const roles = await roleService.findDefaultRoles();
  const resources = await resourceService.findAll();

  roles.map((role) => {
    if (!hashMapOfGrants[role.slug]) return;
    resources.map(async (resource) => {
      const resourceRoles = await resourceRoleService.findAllByRoleAndResource(
        role._id,
        resource._id,
      );
      const permissions: Permission[] = uniq(
        resourceRoles.map((role) => role.permissions).flat(),
      );
      // console.log('B: hashMapOfGrants', role.slug, resource.slug, permissions);
      permissions.map((action) => {
        if (action) {
          rolesBuilder.grant({
            role: role.slug,
            resource: resource.slug,
            action,
          });
        }
      });
    });
  });

  return rolesBuilder;
}

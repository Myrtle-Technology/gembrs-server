import { uniq } from 'lodash';
import { RolesBuilder } from 'nest-access-control';
import { Permission } from './enums/permission.enum';
import { ResourcesEnum } from './enums/resources.enum';
import { RoleEnum } from './enums/role.enum';
import { ResourceRoleService } from './resource-role.service';
import { ResourceService } from './resource.service';
import { RoleService } from './role.service';

export const rolesBuilder: RolesBuilder = new RolesBuilder();

/** Members */
rolesBuilder
  .grant(RoleEnum.Member)
  .readOwn(ResourcesEnum.User)
  .deleteOwn(ResourcesEnum.User)
  .updateOwn(ResourcesEnum.User)
  .readAny(ResourcesEnum.Level);

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
  // membership plans
  .readOwn(ResourcesEnum.Sms)
  .updateOwn(ResourcesEnum.Sms)
  .createOwn(ResourcesEnum.Sms)
  .deleteOwn(ResourcesEnum.Sms);

export async function RolesBuilderFactory(
  roleService: RoleService,
  resourceService: ResourceService,
  resourceRoleService: ResourceRoleService,
): Promise<RolesBuilder> {
  const hashMapOfGrants = rolesBuilder.getGrants();
  const roles = await roleService.findAll();
  const resources = await resourceService.findAll();
  await roleService.onModuleInit();
  await resourceService.onModuleInit();

  roles.map((role) => {
    if (!hashMapOfGrants[role.slug]) return;
    resources.map(async (resource) => {
      if (['admin', 'member'].includes(role.slug)) {
        const permissions = uniq(
          Object.keys(
            hashMapOfGrants[role.slug][resource.slug] ?? {},
          ) as Permission[],
        );
        await resourceRoleService.findOrCreate({
          role: role._id,
          resource: resource._id,
          permissions,
        });
      }
      const resourceRole = await resourceRoleService.findAll();
      const permissions: Permission[] = uniq(
        resourceRole.map((role) => role.permissions).flat(),
      );
      // console.log('hashMapOfGrants', role.slug, resource.slug, permissions);
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

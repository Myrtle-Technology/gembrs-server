import { RolesBuilder } from 'nest-access-control';
import slugify from 'slugify';
import { ResourcesEnum } from './enums/resources.enum';
import { RoleEnum } from './enums/role.enum';
import { RoleService } from './role.service';

export const rolesBuilder: RolesBuilder = new RolesBuilder();

export async function RolesBuilderFactory(
  roleService: RoleService,
): Promise<RolesBuilder> {
  const hashMapOfGrants = rolesBuilder.getGrants();
  // const roles = await roleService.findAll(); // exclude organization roles

  const _roles = Object.keys(hashMapOfGrants).map(async (roleName) => {
    const role = await roleService.findOrCreate({
      name: roleName,
      slug: slugify(roleName),
    });
    // TODO: create resources
    // TODO: create permissions for each resource and role
    return roleName;
  });
  return rolesBuilder;
}

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

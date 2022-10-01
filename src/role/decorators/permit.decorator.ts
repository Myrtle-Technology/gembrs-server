import { applyDecorators, UseGuards } from '@nestjs/common';
import { ACGuard, Role, UseRoles } from 'nest-access-control';
import { Member } from 'src/member/schemas/member.schema';

export const USER_WITHOUT_ORGANIZATION = 'UserWithoutOrganization';
export const Permit = (...roles: Role[]) => {
  return applyDecorators(UseGuards(ACGuard<Member>), UseRoles(...roles));
};

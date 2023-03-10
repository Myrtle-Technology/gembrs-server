import { applyDecorators, UseGuards } from '@nestjs/common';
import { ACGuard, Role, UseRoles } from 'nest-access-control';
import { Member } from 'src/member/schemas/member.schema';

export const Permit = function (...roles: Role[]) {
  return applyDecorators(UseGuards(ACGuard<Member>), UseRoles(...roles));
};

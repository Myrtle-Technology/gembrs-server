import { PartialType } from '@nestjs/swagger';
import { CreateResourceRoleDto } from './create-resource-role.dto';

export class UpdateResourceRoleDto extends PartialType(CreateResourceRoleDto) {}

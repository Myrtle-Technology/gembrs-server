import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Permission } from '../enums/permission.enum';

export class CreateResourceRoleDto {
  @IsString()
  role: string;

  @IsString()
  resource: string;

  @IsEnum(Permission)
  permissions: Permission[];

  @IsString()
  @IsOptional()
  organization?: string;
}

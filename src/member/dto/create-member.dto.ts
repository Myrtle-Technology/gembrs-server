import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateMemberDto {
  organizationId?: number;
  @IsString()
  bio?: string;

  @IsPhoneNumber()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  officeTitle?: string;

  @IsString()
  password?: string;

  // @IsOptional()
  // commonFields?: CreateMemberCommonFieldDto[];
}

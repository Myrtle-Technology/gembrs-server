import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateMemberDto {
  user: string;

  organization: string;

  role: string;

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

import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { MemberStatus } from '../enums/member-status.enum';
import { CreateMemberCustomFieldDto } from './create-member-custom-field.dto';

export class CreateMemberDto {
  user: string;

  organization: string;

  role: string;

  @IsOptional()
  status?: MemberStatus;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsPhoneNumber()
  @IsOptional()
  userPhone?: string;

  @IsPhoneNumber()
  @IsOptional()
  userEmail?: string;

  @IsString()
  @IsOptional()
  officeTitle?: string;

  @IsString()
  password?: string;

  @IsOptional()
  customFields?: CreateMemberCustomFieldDto[];
}

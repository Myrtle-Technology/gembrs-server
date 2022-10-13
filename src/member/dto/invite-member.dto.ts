import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { CreateMemberCustomFieldDto } from './create-member-custom-field.dto';

export class InviteMemberDto {
  organization?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  // requirement will be enforced at the service level
  // to be able to collect either email or phone number
  @IsOptional()
  @IsEmail()
  email: string;

  // requirement will be enforced at the service level
  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsOptional()
  officeTitle?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  membership?: string;

  @IsOptional()
  customFields?: CreateMemberCustomFieldDto[];
}

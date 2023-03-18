import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { CreateMemberCustomFieldDto } from './create-member-custom-field.dto';

export class CreateOneMemberDto {
  @IsString()
  membership: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsPhoneNumber()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  officeTitle?: string;

  @IsOptional()
  customFields?: CreateMemberCustomFieldDto[];

  role?: string;
  notifyMember?: boolean;
}

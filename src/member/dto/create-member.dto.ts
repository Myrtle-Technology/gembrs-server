import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { CreateMemberCustomFieldDto } from './create-member-custom-field.dto';

export class CreateMemberDto {
  user: string;

  organization: string;

  role: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsPhoneNumber()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  officeTitle?: string;

  @IsString()
  password?: string;

  @IsOptional()
  customFields?: CreateMemberCustomFieldDto[];
}

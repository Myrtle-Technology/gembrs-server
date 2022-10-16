import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateMemberCustomFieldDto } from './create-member-custom-field.dto';

export class CreateOneMemberDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @MinLength(6)
  @MaxLength(20)
  password?: string;

  @IsString()
  bio?: string;

  @IsPhoneNumber()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  officeTitle?: string;

  @IsOptional()
  customFields?: CreateMemberCustomFieldDto[];

  membership: string;

  role?: string;
}

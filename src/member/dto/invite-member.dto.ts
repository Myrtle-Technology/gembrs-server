import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class InviteMemberDto {
  organization?: string;
  // requirement will be enforced at the service level
  // to be able to collect either email or phone number
  @IsOptional()
  @IsEmail()
  email: string;

  // requirement will be enforced at the service level
  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  membership?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  makeAdmin?: boolean;
}

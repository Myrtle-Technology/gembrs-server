import { IsString, IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  verifiedEmail?: boolean;
  @IsOptional()
  verifiedPhone?: boolean;
}

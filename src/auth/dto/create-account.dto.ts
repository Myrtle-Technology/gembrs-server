import {
  MinLength,
  MaxLength,
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';
import { IsSlug } from 'src/shared/decorators/is-slug.decorator';
import { IsEqualTo } from '../decorators/is-equal-to.decorator';

export class CreateAccountDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  organizationName: string;
  @IsSlug()
  organizationSlug: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;

  @MinLength(6)
  @MaxLength(20)
  @IsEqualTo('password')
  confirmPassword: string;

  @IsString()
  officeTitle: string;
}

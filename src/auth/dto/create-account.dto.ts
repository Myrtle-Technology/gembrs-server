import {
  MinLength,
  MaxLength,
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';
import { IsSlug } from 'src/shared/decorators/is-slug.decorator';
import { IsEqualTo } from 'src/shared/decorators/is-equal-to.decorator';
import { IsUnique } from 'src/shared/decorators/is-unique.decorator';
import { OrganizationSchema } from 'src/organization/schemas/organization.schema';

export class CreateAccountDto {
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

  @IsString()
  organizationName: string;
  @IsSlug()
  @IsUnique(
    { property: 'siteName', name: 'Organization', schema: OrganizationSchema },
    {
      message:
        'the specified site name has already been used, please choose another one',
    },
  )
  organizationSiteName: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;

  @MinLength(6)
  @MaxLength(20)
  @IsEqualTo('password')
  confirmPassword: string;

  @IsString()
  @IsOptional()
  officeTitle: string;
}

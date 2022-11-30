import { IsString, IsOptional } from 'class-validator';
import { IsSlug } from 'src/shared/decorators/is-slug.decorator';
import { IsUnique } from 'src/shared/decorators/is-unique.decorator';
import { OrganizationSchema } from '../schemas/organization.schema';

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsSlug()
  @IsUnique(
    { property: 'siteName', name: 'Organization', schema: OrganizationSchema },
    {
      message:
        'the specified site name has already been used, please choose another one',
    },
  )
  siteName: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  owner?: string;
}

import { IsOptional, IsString } from 'class-validator';
import { IsSlug } from 'src/shared/decorators/is-slug.decorator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsSlug()
  slug: string;

  @IsOptional()
  organization?: string;
}

import { IsOptional, IsString } from 'class-validator';

export class CreateTemplateDto {
  user: string;

  organization: string;

  @IsString()
  name?: string;

  @IsString()
  @IsOptional()
  html?: string;

  @IsOptional()
  publishedAt?: string;
}

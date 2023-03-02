import { IsOptional, IsString } from 'class-validator';

export class CreateRecipientDto {
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

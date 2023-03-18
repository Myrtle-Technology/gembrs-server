import { IsObject, IsString } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  title: string;

  @IsObject()
  content: Record<string, unknown>;
}

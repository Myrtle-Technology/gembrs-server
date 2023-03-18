import { PartialType } from '@nestjs/swagger';
import { CreateTemplateDto } from '../dto/create-template.dto';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  smsTemplate?: string;
  emailTemplate?: string;
}

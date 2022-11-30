import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { TemplateRepository } from './template.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './schemas/template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: TemplateSchema, name: Template.name },
    ]),
  ],
  controllers: [TemplateController],
  providers: [TemplateService, TemplateRepository],
  exports: [TemplateService, TemplateRepository],
})
export class TemplateModule {}

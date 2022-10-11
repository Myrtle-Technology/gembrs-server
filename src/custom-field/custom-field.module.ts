import { Module } from '@nestjs/common';
import { CustomFieldService } from './custom-field.service';
import { CustomFieldController } from './custom-field.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomFieldSchema } from './schemas/custom-field.schema';
import { CustomFieldRepository } from './custom-field.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CustomField', schema: CustomFieldSchema },
    ]),
  ],
  controllers: [CustomFieldController],
  providers: [CustomFieldService, CustomFieldRepository],
  exports: [CustomFieldService, CustomFieldRepository],
})
export class CustomFieldModule {}

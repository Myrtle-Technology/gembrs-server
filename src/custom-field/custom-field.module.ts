import { Module } from '@nestjs/common';
import { CustomFieldService } from './custom-field.service';
import { CustomFieldController } from './custom-field.controller';

@Module({
  controllers: [CustomFieldController],
  providers: [CustomFieldService]
})
export class CustomFieldModule {}

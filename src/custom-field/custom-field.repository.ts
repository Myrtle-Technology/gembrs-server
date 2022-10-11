import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SharedRepository } from 'src/shared/shared.repository';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { CustomField } from './schemas/custom-field.schema';

export class CustomFieldRepository extends SharedRepository<
  CustomField,
  CreateCustomFieldDto,
  UpdateCustomFieldDto
> {
  constructor(
    @InjectModel(CustomField.name) readonly model: Model<CustomField>,
  ) {
    super(model);
  }
}

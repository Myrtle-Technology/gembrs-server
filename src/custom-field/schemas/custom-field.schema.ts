import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Organization } from 'src/organization/schemas/organization.schema';
import { CustomFieldAttributes } from '../dto/custom-field-attributes.dto';
import { CustomFieldPrivacy } from '../enums/custom-field-privacy';
import { CustomFieldType } from '../enums/custom-field-type.enum';
import {
  CustomFieldOption,
  CustomFieldOptionSchema,
} from './custom-field-option';

@Schema({ timestamps: true })
export class CustomField {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  label: string;

  @Prop()
  description: string;

  @Prop({
    type: String,
    enum: CustomFieldType,
    default: CustomFieldType.text,
  })
  type: CustomFieldType;

  @Prop({ default: false })
  required: boolean;

  @Prop({ type: [{ type: CustomFieldOptionSchema }] })
  options: CustomFieldOption[];

  @Prop({
    type: String,
    enum: CustomFieldPrivacy,
    default: CustomFieldPrivacy.NotVisible,
  })
  privacy: CustomFieldPrivacy;

  @Prop({ default: 10 })
  order: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  attributes: CustomFieldAttributes;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  organization: Organization;

  // add later as form fields.
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Form' })
  // form: Form;
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomField);

CustomFieldSchema.index(
  { organization: 1, name: 1 },
  { unique: true, name: 'custom_field_name' },
);

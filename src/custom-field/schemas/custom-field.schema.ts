import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  label: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({
    type: String,
    enum: CustomFieldType,
    default: CustomFieldType.text,
  })
  type: CustomFieldType;

  @ApiProperty()
  @Prop({ default: false })
  required: boolean;

  @ApiProperty()
  @Prop({ type: [{ type: CustomFieldOptionSchema }] })
  options: CustomFieldOption[];

  @ApiProperty()
  @Prop({
    type: String,
    enum: CustomFieldPrivacy,
    default: CustomFieldPrivacy.NotVisible,
  })
  privacy: CustomFieldPrivacy;

  @ApiProperty()
  @Prop({ default: 10 })
  order: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Mixed })
  attributes: CustomFieldAttributes;

  @ApiProperty()
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  organization: Organization;

  // add later as form fields.
  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Form' })
  // form: Form;
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomField);

CustomFieldSchema.index(
  { organization: 1, name: 1 },
  { unique: true, name: 'custom_field_name' },
);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CustomField } from 'src/custom-field/schemas/custom-field.schema';
import { Member } from './member.schema';

@Schema({ timestamps: true })
export class MemberCustomField {
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  value: any;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true })
  // member: Member;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomField',
    required: true,
  })
  field: CustomField;
}

export const MemberCustomFieldSchema =
  SchemaFactory.createForClass(MemberCustomField);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class CustomFieldOption {
  @Prop()
  label: string;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  value: any;
}

export const CustomFieldOptionSchema =
  SchemaFactory.createForClass(CustomFieldOption);

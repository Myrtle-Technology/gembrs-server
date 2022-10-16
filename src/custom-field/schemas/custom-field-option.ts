import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema()
export class CustomFieldOption {
  @ApiProperty()
  @Prop()
  label: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.Mixed })
  value: any;
}

export const CustomFieldOptionSchema =
  SchemaFactory.createForClass(CustomFieldOption);

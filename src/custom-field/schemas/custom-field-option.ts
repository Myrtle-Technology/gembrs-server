import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CustomFieldOption {
  @Prop()
  label: string;
  @Prop()
  value: any;
}

export const CustomFieldOptionSchema =
  SchemaFactory.createForClass(CustomFieldOption);

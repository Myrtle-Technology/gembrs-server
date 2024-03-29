import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Token extends Document {
  @Prop()
  token: string;

  @Prop()
  identifier: string;

  @Prop()
  verified: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

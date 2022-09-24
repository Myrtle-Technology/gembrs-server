import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Member } from 'src/member/schemas/member.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: number;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop(Boolean)
  verifiedEmail: boolean;

  @Prop(Boolean)
  verifiedPhone: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }] })
  memberships: Member[];
}

export const UserSchema = SchemaFactory.createForClass(User);

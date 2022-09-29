import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Organization } from 'src/organization/schemas/organization.schema';
import { Role } from 'src/role/schemas/role.schema';
import { User } from 'src/user/schemas/user.schema';

// export type MemberDocument = Member & Document;

@Schema()
export class Member extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organization: Organization;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  @Prop()
  bio: string;

  @Prop()
  contactPhone: string;

  @Prop()
  officeTitle: string;

  @Prop()
  password: string;

  // @OneToMany(() => MemberCommonField, (c) => c.member, { eager: true })
  // commonFields: MemberCommonField[];

  // @OneToMany(() => Subscription, (subscription) => subscription.member)
  // subscriptions: Subscription[];
}

export const MemberSchema = SchemaFactory.createForClass(Member);

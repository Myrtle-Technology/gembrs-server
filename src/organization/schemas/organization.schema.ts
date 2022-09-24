import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Member } from 'src/member/schemas/member.schema';
import { User } from 'src/user/schemas/user.schema';

export type OrganizationDocument = Organization & Document;

@Schema()
export class Organization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  siteName: string;

  @Prop()
  contactEmail: string;

  @Prop()
  contactPhone: string;

  @Prop()
  bio: number;

  @Prop()
  logoUrl: string;

  @Prop()
  address: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }] })
  members: Member[];

  // @OneToMany(() => Role, (role) => role.ownerOrganization)
  // roles: Role[];

  // @OneToMany(() => CommonField, (commonField) => commonField.organization)
  // commonFields: CommonField[];

  // @OneToMany(() => MembershipPlan, (mp) => mp.organization, { eager: true })
  // membershipPlans: MembershipPlan[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

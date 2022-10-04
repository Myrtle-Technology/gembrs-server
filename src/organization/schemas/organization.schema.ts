import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import { Member } from 'src/member/schemas/member.schema';
import { Role } from 'src/role/schemas/role.schema';
import { User } from 'src/user/schemas/user.schema';

// export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
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

  @Prop()
  currency: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }] })
  members: Member[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  // @OneToMany(() => CommonField, (commonField) => commonField.organization)
  // commonFields: CommonField[];

  // @OneToMany(() => MembershipPlan, (mp) => mp.organization, { eager: true })
  // membershipPlans: MembershipPlan[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

OrganizationSchema.plugin(mongoosePagination);

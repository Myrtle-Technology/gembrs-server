import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { Member } from 'src/member/schemas/member.schema';
import { Role } from 'src/role/schemas/role.schema';
import { User } from 'src/user/schemas/user.schema';

// export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization extends Document {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  siteName: string;

  @ApiProperty()
  @Prop()
  contactEmail: string;

  @ApiProperty()
  @Prop()
  contactPhone: string;

  @ApiProperty()
  @Prop()
  bio: number;

  @ApiProperty()
  @Prop()
  logoUrl: string;

  @ApiProperty()
  @Prop()
  address: string;

  @ApiProperty()
  @Prop()
  state: string;

  @ApiProperty()
  @Prop()
  country: string;

  @ApiProperty()
  @Prop()
  currency: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }] })
  members: Member[];

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  // @OneToMany(() => CommonField, (commonField) => commonField.organization)
  // commonFields: CommonField[];

  // @OneToMany(() => MembershipPlan, (mp) => mp.organization, { eager: true })
  // membershipPlans: MembershipPlan[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

OrganizationSchema.plugin(mongoosePagination);

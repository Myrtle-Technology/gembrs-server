import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { Organization } from 'src/organization/schemas/organization.schema';
import { Role } from 'src/role/schemas/role.schema';
import { Subscription } from 'src/subscription/schemas/subscription.schema';
import { User } from 'src/user/schemas/user.schema';
import { MemberStatus } from '../enums/member-status.enum';
import {
  MemberCustomField,
  MemberCustomFieldSchema,
} from './member-custom-field.schema';

// export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Member extends Document {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @ApiProperty()
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  organization: Organization;

  @ApiProperty()
  @Prop({
    // required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  })
  subscription: Subscription;

  @ApiProperty()
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  // https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design
  // Added the userName field and the userEmail fields for de-normalization to aid searching and pagination
  @ApiProperty()
  @Prop({ index: true })
  userName: string;

  @ApiProperty()
  @Prop({ index: true })
  userEmail: string;

  @ApiProperty()
  @Prop({ index: true })
  userPhone: string;

  @ApiProperty()
  @Prop({ required: false, index: true })
  bio: string;

  /** @deprecated */
  @ApiProperty()
  @Prop({ required: false })
  contactPhone: string;

  @ApiProperty()
  @Prop({ required: false })
  officeTitle: string;

  @ApiProperty()
  @Prop({ type: String, enum: MemberStatus, default: MemberStatus.ACCEPTED })
  status: MemberStatus;

  @ApiProperty()
  @Prop({ select: false, required: false })
  password: string;

  @ApiProperty()
  @Prop({ required: false, type: [{ type: MemberCustomFieldSchema }] })
  customFields: MemberCustomField[];

  // @OneToMany(() => Subscription, (subscription) => subscription.member)
  // subscriptions: Subscription[];
}

export const MemberSchema = SchemaFactory.createForClass(Member);
MemberSchema.index({ '$**': 'text' });
MemberSchema.index({ 'customFields.$**': 'text' });
MemberSchema.plugin(mongoosePagination);

// update the userName field whenever the user field is updated.
MemberSchema.pre('save', async function (next) {
  const member = this as Member;
  if (member.isModified('user')) {
    const user: User = await this.$model('User').findById(member.user);
    member.userName = `${user.firstName} ${user.lastName}`;
    member.userEmail = user.email;
    member.userPhone = user.phone;
  }
  next();
});
// update the userName field whenever a new member document is created.
MemberSchema.post('save', async function (doc) {
  const member = doc as Member;
  const user: User = await this.$model('User').findById(member.user);
  member.userName = `${user.firstName} ${user.lastName}`;
  member.userEmail = user.email;
  member.userPhone = user.phone;
  member.save();
});

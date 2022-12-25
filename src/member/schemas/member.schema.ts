import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { Organization } from 'src/organization/schemas/organization.schema';
import { Role } from 'src/role/schemas/role.schema';
import { User } from 'src/user/schemas/user.schema';
import {
  MemberCustomField,
  MemberCustomFieldSchema,
} from './member-custom-field.schema';

// export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Member extends Document {
  @ApiProperty()
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @ApiProperty()
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  organization: Organization;

  @ApiProperty()
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  // https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design
  // Added the userName field and the userEmail fields for de-normalization to aid searching and pagination
  @ApiProperty()
  @Prop()
  userName: string;

  @ApiProperty()
  @Prop()
  userEmail: string;

  @ApiProperty()
  @Prop()
  bio: string;

  @ApiProperty()
  @Prop()
  contactPhone: string;

  @ApiProperty()
  @Prop()
  officeTitle: string;

  @ApiProperty()
  @Prop({ select: false })
  password: string;

  @ApiProperty()
  @Prop({ type: [{ type: MemberCustomFieldSchema }] })
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
    member.userEmail = `${user.firstName} ${user.lastName}`;
  }
  next();
});
// update the userName field whenever a new member document is created.
MemberSchema.post('save', async function (doc) {
  const member = doc as Member;
  const user: User = await this.$model('User').findById(member.user);
  member.userName = `${user.firstName} ${user.lastName}`;
  member.userEmail = `${user.firstName} ${user.lastName}`;
  await member.save();
});

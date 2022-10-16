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

MemberSchema.plugin(mongoosePagination);

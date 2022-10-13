import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Membership } from 'src/membership/schemas/membership.schema';
import { Organization } from 'src/organization/schemas/organization.schema';
import { Role } from 'src/role/schemas/role.schema';
import { User } from 'src/user/schemas/user.schema';
import { InvitationStatus } from '../enums/invitation-status.enum';

@Schema({ timestamps: true })
export class Invitation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organization: Organization;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Membership' })
  membership: Membership;

  @Prop()
  token: string;

  @Prop({
    type: String,
    enum: InvitationStatus,
    default: InvitationStatus.Pending,
  })
  status: InvitationStatus;

  @Prop({
    default: () => Date.now() + 1000 * 60 * 60 * 24 * 7,
    type: Date,
  })
  expiresAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

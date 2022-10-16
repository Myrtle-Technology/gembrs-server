import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Member } from 'src/member/schemas/member.schema';
import { PaymentMethod } from 'src/membership/enums/payment-method.enum';
import { Membership } from 'src/membership/schemas/membership.schema';
import { Organization } from 'src/organization/schemas/organization.schema';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ required: true })
  status: SubscriptionStatus;

  @Prop({ required: true })
  currentPeriodStart: Date;

  @Prop({ required: true })
  currentPeriodEnd: Date;

  @Prop({ default: true })
  cancelAtPeriodEnd: boolean;

  @Prop({ nullable: true })
  cancelAt: Date;

  @Prop({ nullable: true })
  canceledAt: Date;

  @Prop({ nullable: true })
  endedAt: Date;

  @Prop({
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.Offline,
  })
  defaultPaymentMethod: PaymentMethod;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organization: Organization;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Membership' })
  membership: Membership;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
  member: Member;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

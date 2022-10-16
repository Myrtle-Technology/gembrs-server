import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Member } from 'src/member/schemas/member.schema';
import { PaymentMethod } from 'src/membership/enums/payment-method.enum';
import { Membership } from 'src/membership/schemas/membership.schema';
import { Organization } from 'src/organization/schemas/organization.schema';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

@Schema({ timestamps: true })
export class Subscription {
  @ApiProperty()
  @Prop({ required: true })
  status: SubscriptionStatus;

  @ApiProperty()
  @Prop({ required: true })
  currentPeriodStart: Date;

  @ApiProperty()
  @Prop({ required: true })
  currentPeriodEnd: Date;

  @ApiProperty()
  @Prop({ default: true })
  cancelAtPeriodEnd: boolean;

  @ApiProperty()
  @Prop({ nullable: true })
  cancelAt: Date;

  @ApiProperty()
  @Prop({ nullable: true })
  canceledAt: Date;

  @ApiProperty()
  @Prop({ nullable: true })
  endedAt: Date;

  @ApiProperty()
  @Prop({
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.Offline,
  })
  defaultPaymentMethod: PaymentMethod;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organization: Organization;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Membership' })
  membership: Membership;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
  member: Member;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

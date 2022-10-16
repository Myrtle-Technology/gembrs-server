import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Organization } from 'src/organization/schemas/organization.schema';
import { PaymentStatus } from '../enums/payment-status.enum';
import { Subscription } from './subscription.schema';

@Schema({ timestamps: true })
export class Payment {
  @ApiProperty()
  @Prop({ required: true })
  status: PaymentStatus;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organization: Organization;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' })
  subscription: Subscription;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { Organization } from 'src/organization/schemas/organization.schema';
import { PaymentStatus } from '../enums/payment-status.enum';
import { Subscription } from './subscription.schema';

@Schema({ timestamps: true })
export class Payment {
  @ApiProperty()
  @Prop({ required: true })
  status: PaymentStatus;

  @ApiProperty()
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  organization: Organization;

  @ApiProperty()
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  })
  subscription: Subscription;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.plugin(mongoosePagination);

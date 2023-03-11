import { Campaign } from './campaign.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { User } from 'src/user/schemas/user.schema';
import { DeliveryChannel } from '../enums/delivery-channel.enum';
import { DeliveryStatus } from '../enums/delivery-status.enum';

@Schema({ timestamps: true })
export class Recipient extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  })
  campaign: Campaign;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop({
    required: true,
    enum: DeliveryChannel,
    default: DeliveryChannel.EMAIL,
  })
  channel: DeliveryChannel; // sms, email, push, etc.

  @Prop({
    required: true,
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus; // sent, failed, etc.

  @Prop()
  message: string;

  @Prop()
  error: string;

  @Prop()
  sentAt: Date;

  @Prop()
  deliveredAt: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  metadata: Record<string, unknown>;
}
export const RecipientSchema = SchemaFactory.createForClass(Recipient);

RecipientSchema.plugin(mongoosePagination);

RecipientSchema.index(
  { campaign: 1, user: 1, channel: 1 },
  { unique: true, name: 'campaign_user_channel' },
);

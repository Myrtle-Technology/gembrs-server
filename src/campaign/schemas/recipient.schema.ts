import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { User } from 'src/user/schemas/user.schema';
import { DeliveryChannel } from '../enums/delivery-channel.enum';
import { DeliveryStatus } from '../enums/delivery-status.enum';

@Schema({ timestamps: true })
export class Recipient {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

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
}
export const RecipientSchema = SchemaFactory.createForClass(Recipient);

RecipientSchema.plugin(mongoosePagination);

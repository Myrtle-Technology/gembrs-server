import { Recipient } from './recipient.schema';
import { Template } from './template.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import mongoose, { Document } from 'mongoose';
import { CampaignStatus } from '../enums/campaign-status.enum';
import { User } from 'src/user/schemas/user.schema';
import { UpdateCampaignRecipientDto } from '../dto/update-campaign.dto';

@Schema({ timestamps: true })
export class Campaign extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: CampaignStatus, default: CampaignStatus.DRAFT })
  status: CampaignStatus; // draft, scheduled, sent, etc.

  @Prop({ required: false })
  scheduledAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true,
  })
  template: Template;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipient' }] })
  recipients: Recipient[];

  @Prop({ type: mongoose.Schema.Types.Mixed })
  dummyRecipient: UpdateCampaignRecipientDto[];
}
export const CampaignSchema = SchemaFactory.createForClass(Campaign);

CampaignSchema.plugin(mongoosePagination);

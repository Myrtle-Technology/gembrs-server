import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import { Organization } from 'src/organization/schemas/organization.schema';
import { PaymentMethod } from '../enums/payment-method.enum';
import { MembershipType } from '../enums/membership-type.enum';
import {
  BundleAdminWorkflowSettings,
  BundleAdminWorkflowSettingsSchema,
} from './bundle-admin-workflow-settings.schema';
import { RenewalPeriod, RenewalPeriodSchema } from './renewal-period.schema';
import { ApiProperty } from '@nestjs/swagger';
import { RenewalReminder } from './renewal-reminder.schema';

// export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Membership extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  fee: string;

  @Prop({
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.Offline,
  })
  paymentMethod: PaymentMethod;

  @Prop({
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.Offline,
  })
  type: MembershipType;
  @Prop()
  isPublic: boolean;

  @Prop({ type: RenewalPeriodSchema })
  renewalPeriod: RenewalPeriod;

  @Prop({ default: false })
  approveApplication: boolean;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Membership' }] })
  changeableTo: Membership[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organization: Organization;

  @ApiProperty({ type: () => BundleAdminWorkflowSettings })
  @Prop({ type: BundleAdminWorkflowSettingsSchema })
  bundleAdminWorkflowSettings: BundleAdminWorkflowSettings;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder })
  renewalReminderBefore1: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder })
  renewalReminderBefore2: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder })
  renewalReminderOnDueDate: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder })
  renewalReminderAfter1: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder })
  renewalReminderAfter2: RenewalReminder;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

MembershipSchema.plugin(mongoosePagination);

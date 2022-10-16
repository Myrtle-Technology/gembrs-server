import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { Organization } from 'src/organization/schemas/organization.schema';
import { PaymentMethod } from '../enums/payment-method.enum';
import { MembershipType } from '../enums/membership-type.enum';
import {
  BundleAdminWorkflowSettings,
  BundleAdminWorkflowSettingsSchema,
} from './bundle-admin-workflow-settings.schema';
import { RenewalPeriod, RenewalPeriodSchema } from './renewal-period.schema';
import { ApiProperty } from '@nestjs/swagger';
import {
  RenewalReminder,
  renewalReminderAfter1,
  renewalReminderAfter2,
  renewalReminderBefore1,
  renewalReminderBefore2,
  renewalReminderOnDueDate,
} from './renewal-reminder.schema';

// export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Membership extends Document {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  fee: string;

  @ApiProperty()
  @Prop({
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.Offline,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @Prop({
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.Offline,
  })
  type: MembershipType;
  @ApiProperty()
  @Prop()
  isPublic: boolean;

  @ApiProperty()
  @Prop({ type: RenewalPeriodSchema })
  renewalPeriod: RenewalPeriod;

  @ApiProperty()
  @Prop({ default: false })
  approveApplication: boolean;

  @ApiProperty()
  @Prop({ default: true })
  active: boolean;

  @ApiProperty({ type: () => Membership, isArray: true })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Membership' }] })
  changeableTo: Membership[];

  @ApiProperty()
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  organization: Organization;

  @ApiProperty({ type: () => BundleAdminWorkflowSettings })
  @Prop({ type: BundleAdminWorkflowSettingsSchema })
  bundleAdminWorkflowSettings: BundleAdminWorkflowSettings;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder, default: renewalReminderBefore1 })
  renewalReminderBefore1: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder, default: renewalReminderBefore2 })
  renewalReminderBefore2: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder, default: renewalReminderOnDueDate })
  renewalReminderOnDueDate: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder, default: renewalReminderAfter1 })
  renewalReminderAfter1: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder, default: renewalReminderAfter2 })
  renewalReminderAfter2: RenewalReminder;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

MembershipSchema.plugin(mongoosePagination);

MembershipSchema.index(
  { organization: 1, name: 1 },
  { unique: true, name: 'membership_name' },
);

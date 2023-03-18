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
  defaultRenewalReminderAfter1,
  defaultRenewalReminderAfter2,
  defaultRenewalReminderBefore1,
  defaultRenewalReminderBefore2,
  defaultRenewalReminderOnDueDate,
} from './renewal-reminder.schema';
import {
  CustomField,
  CustomFieldSchema,
} from 'src/custom-field/schemas/custom-field.schema';
import { MembershipAccess } from '../enums/membership-access.enum';

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
  color: string;

  @ApiProperty()
  @Prop()
  fee: number;

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
    default: MembershipType.Individual,
    enum: MembershipType,
  })
  type: MembershipType;

  @ApiProperty()
  @Prop({
    type: String,
    default: MembershipAccess.OPEN,
    enum: MembershipAccess,
  })
  access: MembershipAccess;

  /**@deprecated not needed anymore */
  @ApiProperty()
  @Prop()
  isPublic: boolean;

  /**@deprecated not needed anymore */
  @ApiProperty()
  @Prop({ default: false })
  approveApplication: boolean;

  @ApiProperty()
  @Prop({ type: RenewalPeriodSchema })
  renewalPeriod: RenewalPeriod;

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

  @ApiProperty({ type: () => CustomField, isArray: true })
  @Prop({
    type: [{ type: CustomFieldSchema }],
  })
  questions: CustomField[];

  @ApiProperty({ type: () => BundleAdminWorkflowSettings })
  @Prop({ type: BundleAdminWorkflowSettingsSchema })
  bundleAdminWorkflowSettings: BundleAdminWorkflowSettings;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder, default: defaultRenewalReminderBefore1 })
  renewalReminderBefore1: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder, default: defaultRenewalReminderBefore2 })
  renewalReminderBefore2: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder, default: defaultRenewalReminderOnDueDate })
  renewalReminderOnDueDate: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder, default: defaultRenewalReminderAfter1 })
  renewalReminderAfter1: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  @Prop({ type: RenewalReminder, default: defaultRenewalReminderAfter2 })
  renewalReminderAfter2: RenewalReminder;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

MembershipSchema.plugin(mongoosePagination);

MembershipSchema.index(
  { organization: 1, name: 1 },
  { unique: true, name: 'membership_name' },
);

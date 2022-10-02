import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Organization } from 'src/organization/schemas/organization.schema';
import { PaymentMethod } from '../enums/payment-method.enum';
import { MembershipType } from '../enums/membership-type.enum';
import { BundleAdminWorkflowSettings } from './bundle-admin-workflow-settings.schema';
import { RenewalPeriod, RenewalPeriodSchema } from './renewal-period.schema';

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

  bundleAdminWorkflowSettings: BundleAdminWorkflowSettings;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

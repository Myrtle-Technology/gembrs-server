import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class BundleAdminWorkflowSettings {
  @Prop()
  membershipMustBeApprovedByAdmin: boolean;

  @Prop()
  paymentMustBeReceivedBeforeMemberActivated: boolean;
}

export const BundleAdminWorkflowSettingsSchema = SchemaFactory.createForClass(
  BundleAdminWorkflowSettings,
);

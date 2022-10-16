import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class BundleAdminWorkflowSettings {
  @ApiProperty()
  @Prop()
  membershipMustBeApprovedByAdmin: boolean;

  @ApiProperty()
  @Prop()
  paymentMustBeReceivedBeforeMemberActivated: boolean;
}

export const BundleAdminWorkflowSettingsSchema = SchemaFactory.createForClass(
  BundleAdminWorkflowSettings,
);

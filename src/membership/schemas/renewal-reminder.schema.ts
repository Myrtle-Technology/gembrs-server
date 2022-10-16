import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RenewalReminderEmailRecipients } from '../enums/renewal-reminder-email-recipients.enum';
import { RenewalReminderWhen } from '../enums/renewal-reminder-when.enum';

@Schema()
export class RenewalReminder {
  @ApiProperty()
  @Prop()
  noOfDays: number;

  @ApiProperty({ description: '`on`, `before`, or `after` renewal date' })
  @Prop({
    type: String,
    enum: RenewalReminderWhen,
    default: RenewalReminderWhen.On,
  })
  when: RenewalReminderWhen;

  @ApiProperty()
  @Prop()
  sendEmail: boolean;

  @ApiProperty()
  @Prop({
    type: [String],
    enum: RenewalReminderEmailRecipients,
    default: [RenewalReminderEmailRecipients.Member],
  })
  sendEmailTo: RenewalReminderEmailRecipients[];

  @ApiProperty()
  @Prop()
  changeMembershipLevelTo: string;
}

export const RenewalReminderSchema =
  SchemaFactory.createForClass(RenewalReminder);

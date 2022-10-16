import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
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
  @IsEnum(RenewalReminderWhen)
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

// defaults
export const renewalReminderBefore1: RenewalReminder = {
  noOfDays: 7,
  sendEmail: true,
  sendEmailTo: [RenewalReminderEmailRecipients.Member],
  when: RenewalReminderWhen.Before,
  changeMembershipLevelTo: null,
};

export const renewalReminderBefore2: RenewalReminder = {
  noOfDays: 14,
  sendEmail: true,
  sendEmailTo: [RenewalReminderEmailRecipients.Member],
  when: RenewalReminderWhen.Before,
  changeMembershipLevelTo: null,
};

export const renewalReminderOnDueDate: RenewalReminder = {
  noOfDays: 7,
  sendEmail: true,
  sendEmailTo: [RenewalReminderEmailRecipients.Member],
  when: RenewalReminderWhen.On,
  changeMembershipLevelTo: null,
};

export const renewalReminderAfter1: RenewalReminder = {
  noOfDays: 7,
  sendEmail: true,
  sendEmailTo: [RenewalReminderEmailRecipients.Member],
  when: RenewalReminderWhen.After,
  changeMembershipLevelTo: null,
};

export const renewalReminderAfter2: RenewalReminder = {
  noOfDays: 14,
  sendEmail: true,
  sendEmailTo: [RenewalReminderEmailRecipients.Member],
  when: RenewalReminderWhen.After,
  changeMembershipLevelTo: null,
};

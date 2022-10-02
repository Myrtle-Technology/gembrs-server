import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import { BundleAdminWorkflowSettings } from '../schemas/bundle-admin-workflow-settings.schema';
import { RenewalPeriod } from '../schemas/renewal-period.schema';
import { RenewalReminder } from '../schemas/renewal-reminder.schema';

export class CreateMembershipDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  membershipFee: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  @IsArray()
  changeableTo: string[];

  @ApiProperty({ type: () => RenewalPeriod })
  renewalPeriod: RenewalPeriod;

  @IsOptional()
  approveApplication: boolean;

  @IsOptional()
  active: boolean;

  @IsOptional()
  organization: string;

  @ApiProperty({ type: () => BundleAdminWorkflowSettings })
  bundleAdminWorkflowSettings: BundleAdminWorkflowSettings;

  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderAfter1: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderAfter2: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderBefore1: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderBefore2: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderOnDueDate: RenewalReminder;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsUnique } from 'src/shared/decorators/is-unique.decorator';
import { MembershipType } from '../enums/membership-type.enum';
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
  fee: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsEnum(MembershipType)
  type: MembershipType;

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

  @IsOptional()
  @ApiProperty({ type: () => BundleAdminWorkflowSettings })
  bundleAdminWorkflowSettings: BundleAdminWorkflowSettings;

  @IsOptional()
  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderAfter1: RenewalReminder;

  @IsOptional()
  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderAfter2: RenewalReminder;

  @IsOptional()
  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderBefore1: RenewalReminder;

  @IsOptional()
  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderBefore2: RenewalReminder;

  @IsOptional()
  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderOnDueDate: RenewalReminder;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateCustomFieldDto } from 'src/custom-field/dto/create-custom-field.dto';
import { MembershipAccess } from '../enums/membership-access.enum';
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

  @IsString()
  @IsOptional()
  color: string;

  @IsNumber()
  fee: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsEnum(MembershipType)
  type: MembershipType;

  @IsEnum(MembershipAccess)
  access: MembershipAccess;

  @IsOptional()
  @IsArray()
  questions: CreateCustomFieldDto[];

  @ApiProperty({ type: () => RenewalPeriod })
  @IsObject()
  renewalPeriod: RenewalPeriod;

  @IsOptional()
  active: boolean;

  @IsOptional()
  organization: string;

  /*

  @IsOptional()
  @IsArray()
  changeableTo: string[];

  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  approveApplication: boolean;

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
  renewalReminderOnDueDate: RenewalReminder;*/
}

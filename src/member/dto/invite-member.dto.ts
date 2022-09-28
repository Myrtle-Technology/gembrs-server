import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class InviteMemberDto {
  organizationId?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsOptional()
  officeTitle?: string;

  @IsString()
  password?: string;

  // membershipPlanId: string;

  // @IsOptional()
  // commonFields?: CreateMemberCommonFieldDto[];
}

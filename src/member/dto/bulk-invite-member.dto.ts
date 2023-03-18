import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class BulkInviteMemberDto {
  organization?: string;
  // requirement will be enforced at the service level
  // to be able to collect either email or phone number
  @IsOptional()
  usernames: string[];

  @IsOptional()
  membership?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  makeAdmin?: boolean;
}

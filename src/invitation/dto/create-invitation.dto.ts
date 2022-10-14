export class CreateInvitationDto {
  user: string;
  role: string;
  organization: string;
  membership: string;
  status?: string;
  expiresAt?: Date;
}

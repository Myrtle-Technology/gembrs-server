export class CreateInvitationDto {
  user: string;
  role: string;
  organization: string;
  membership: string;
  token: string;
  status?: string;
  expiresAt?: Date;
}

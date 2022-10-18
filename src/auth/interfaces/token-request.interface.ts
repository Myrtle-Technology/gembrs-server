import { Request } from 'express';
import { Member } from 'src/member/schemas/member.schema';
import { Organization } from 'src/organization/schemas/organization.schema';
import { TokenData } from '../dto/token-data.dto';

export interface TokenRequest extends Request {
  user: Member;
  tokenData: TokenData;
  organization: Organization;
}

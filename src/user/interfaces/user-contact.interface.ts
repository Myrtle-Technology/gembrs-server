import { Organization } from 'src/organization/schemas/organization.schema';
import { User } from '../schemas/user.schema';

export interface UserContact {
  organization: Organization;
  contacts: User[];
}

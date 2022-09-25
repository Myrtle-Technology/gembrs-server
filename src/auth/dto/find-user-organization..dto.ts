import { IsUsername } from '../decorators/is-username.decorator';

export class FindUserOrganization {
  @IsUsername()
  username: string;
}

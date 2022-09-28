import { IsUsername } from 'src/shared/decorators/is-username.decorator';

export class FindUserOrganization {
  @IsUsername()
  username: string;
}

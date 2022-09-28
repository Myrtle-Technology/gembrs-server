import { IsUsername } from 'src/shared/decorators/is-username.decorator';

export class VerifyEmailDto {
  @IsUsername()
  username: string;
}

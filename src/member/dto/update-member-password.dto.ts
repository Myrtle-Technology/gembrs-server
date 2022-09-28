import { IsString } from 'class-validator';
import { IsEqualTo } from 'src/shared/decorators/is-equal-to.decorator';

export class UpdateMemberPasswordDto {
  @IsString()
  password: string;
  @IsEqualTo('password')
  passwordConfirm: string;
}

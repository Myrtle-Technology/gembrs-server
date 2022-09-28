import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
// import { CreateMemberCommonFieldDto } from 'src/member-common-field/dto/create-member-common-field.dto';
import { IsUsername } from 'src/shared/decorators/is-username.decorator';

export class RegisterMember {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsUsername()
  username: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;
  membershipPlanId: number;
  // commonFields: CreateMemberCommonFieldDto[];
}

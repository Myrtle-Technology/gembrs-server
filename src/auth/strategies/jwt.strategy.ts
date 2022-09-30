import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';
import { Member } from 'src/member/schemas/member.schema';
import { MemberService } from 'src/member/member.service';
import { TokenData } from '../dto/token-data.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public userService: UserService,
    public memberService: MemberService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: TokenData) {
    const user = await this.userService.findByUsername(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (payload.organizationId) {
      const member = await this.memberService.findOne(
        payload.organizationId,
        payload.memberId,
        ['role', 'organization', 'user'],
      );

      if (!member) {
        throw new UnauthorizedException(
          'Unauthorized, please login to continue',
        );
      }
      // workaround for ACGuard
      (member as any).roles = [member.role.slug];
      return member;
    }
    return user;
  }
}

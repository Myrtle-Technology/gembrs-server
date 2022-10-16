import {
  BadRequestException,
  Injectable,
  Scope,
  Inject,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { User } from 'src/user/schemas/user.schema';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { isEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Member } from 'src/member/schemas/member.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { OrganizationService } from 'src/organization/organization.service';
import { FindUserOrganization } from './dto/find-user-organization..dto';
import { MemberService } from 'src/member/member.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ConfigService } from '@nestjs/config';
import { ORGANIZATION_API_HEADER } from './decorators/organization-api.decorator';
import { RoleService } from 'src/role/services/role.service';
import { TokenData } from './dto/token-data.dto';
import { TokenRequest } from './interfaces/token-request.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { MailService } from 'src/mail/mail.service';
import { SmsService } from 'src/sms/sms.service';
import { TokenRepository } from './token.repository';
import { Organization } from 'src/organization/schemas/organization.schema';
import { CreateOneMemberDto } from 'src/member/dto/create-one-member.dto';
import { InvitationService } from 'src/invitation/invitation.service';
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private readonly isDevServer: string =
    this.configService.get<string>('IS_DEV_SERVER');
  constructor(
    @Inject(REQUEST) private request: TokenRequest,
    private tokenRepo: TokenRepository,
    private mailService: MailService,
    private smsService: SmsService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private roleService: RoleService,
    private organizationService: OrganizationService,
    private memberService: MemberService,
    private invitationService: InvitationService,
  ) {}

  get organizationSlug() {
    return this.request.headers[ORGANIZATION_API_HEADER];
  }

  get organizationId() {
    return this.request.tokenData.organizationId;
  }

  async verifyEmailOrPhone(dto: VerifyEmailDto) {
    // if (!(this.isDevServer == 'true')) {
    if (isEmail(dto.username)) {
      const code = Math.floor(100000 + Math.random() * 900000);
      const token = await this.createToken(dto.username, code.toString());
      await this.mailService.sendVerificationCode(
        dto.username,
        token.toObject().token,
      );
    } else {
      await this.smsService.sendOTP(dto.username);
    }
    // }
    return { message: 'otp sent to user' };
  }

  async createToken(identifier: string, code: string) {
    const token = await this.tokenRepo.findOne({ identifier });
    if (token) {
      await token.remove();
    }
    return this.tokenRepo.create({
      token: code.toString(),
      identifier: identifier,
    });
  }

  async validateOTP(dto: VerifyOtpDto) {
    const user = await this.userService.findByUsername(dto.username);
    // if (!(this.isDevServer == 'true')) {
    if (isEmail(dto.username)) {
      const token = await this.tokenRepo.findByIdentifier(
        dto.otp,
        dto.username,
      );
      if (!token) {
        throw new BadRequestException(
          `The one time password (OTP) you entered is invalid`,
        );
      }
      await token.remove();
      user.verifiedEmail = true;
    } else {
      this.smsService.verifyOTP(user.phone, dto.otp.toString());
      user.verifiedPhone = true;
    }
    // }
    await this.userService.repo.updateById(user._id, {
      verifiedEmail: user.verifiedEmail,
      verifiedPhone: user.verifiedPhone,
    });
    const payload = {
      username: user.email || user.phone,
      userId: user.id,
    };
    // this access token will be used to access only 1 route
    // find User Organizations
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '24h' }),
      user: user,
    };
  }

  async validateMember(dto: LoginDto) {
    const user: User = await this.userService.findByUsername(dto.username);
    const organizationSlug = this.request.headers[
      ORGANIZATION_API_HEADER
    ] as string;
    if (!organizationSlug) {
      throw new BadRequestException(
        'Please specify the organization you want to login to',
      );
    }

    const organization = await this.organizationService.findBySiteName(
      organizationSlug,
    );
    if (!organization) {
      throw new NotFoundException(
        `We do not have an organization with the site name "${organizationSlug}"`,
      );
    }
    const member = await this.memberService.findWithPassword(
      organization._id,
      user._id,
      ['organization', 'user', 'role'],
    );
    if (!member) {
      throw new UnauthorizedException(
        `You are not a member of this organization, try joining the organization first.`,
      );
    }

    const passwordMatch = await bcrypt.compare(dto.password, member.password);
    if (!passwordMatch) {
      throw new UnauthorizedException(
        `Invalid username or password, please check your details and try again`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = member.toJSON<Member>();
    return result;
  }

  async loginToOrganization(dto: LoginDto) {
    const member = (this.request as any).user;
    return this.getAuthData(member, dto);
  }

  async getAuthData(member: Member, dto?: LoginDto) {
    const payload: TokenData = {
      username: dto?.username || member.user.email || member.user.phone,
      memberId: member._id,
      organizationId: member.organization?._id ?? member.organization,
      userId: member.user?._id ?? member.user,
      roleId: member.role?._id ?? member.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: member,
    };
  }

  async findUserOrganizations(
    dto: FindUserOrganization,
  ): Promise<Organization[]> {
    const user = await this.userService.findByUsername(dto.username);

    return this.organizationService.repo.find({
      owner: user._id,
    });
  }

  async createNewAccount(dto: CreateAccountDto) {
    const user = (
      await this.userService.findOrCreate({
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      })
    )[0];
    const organization = await this.organizationService.createOne({
      // contactEmail: user.email,
      name: dto.organizationName,
      siteName: dto.organizationSiteName,
      owner: user._id,
      // contactPhone: user.phone,
    });
    const role = await this.roleService.getDefaultAdminRole();
    const member = await this.memberService.create({
      organization: organization._id,
      user: user._id,
      role: role._id,
      password: dto.password,
      officeTitle: dto.officeTitle,
      // contactPhone: user.phone,
    });
    this.verifyEmailOrPhone({ username: user.email || user.phone });
    return this.getAuthData(
      await this.memberService.findById(member._id, [
        'organization',
        'user',
        'role',
      ]),
    );
  }

  async validateNewUserOTP(memberId: string, dto: VerifyOtpDto) {
    const user = await this.userService.findByUsername(dto.username);
    // if (!(this.isDevServer == 'true')) {
    if (isEmail(dto.username)) {
      const token = await this.tokenRepo.findByIdentifier(
        dto.otp,
        dto.username,
      );
      if (!token) {
        throw new BadRequestException(
          `The one time password (OTP) you entered is invalid`,
        );
      }
      await token.remove();
      user.verifiedEmail = true;
    } else {
      this.smsService.verifyOTP(user.phone, dto.otp.toString());
      user.verifiedPhone = true;
    }
    // }
    await this.userService.repo.updateById(user._id, {
      verifiedEmail: user.verifiedEmail,
      verifiedPhone: user.verifiedPhone,
    });
    const member = await this.memberService.findById(memberId, [
      'organization',
      'user',
      'role',
    ]);
    this.mailService.welcomeRegisteredOrganization(user, member.organization);
    return this.getAuthData(member);
  }

  async initForgotMemberPassword() {
    //
  }

  async resetMemberPassword() {
    //
  }

  async acceptOrganizationInvite(organization: string, invitation: string) {
    return this.invitationService.acceptOrganizationInvite(
      organization,
      invitation,
    );
  }

  async registerMember(organization: string, dto: CreateOneMemberDto) {
    return this.memberService.createOne(organization, dto);
  }
}

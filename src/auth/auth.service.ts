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
import { ObjectId } from 'mongoose';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import slugify from 'slugify';
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

  async sendOtpToEmailOrPhone(dto: VerifyEmailDto) {
    // if (!(this.isDevServer == 'true')) {
    if (isEmail(dto.username)) {
      const code = Math.floor(100000 + Math.random() * 900000);
      const token = await this.createToken(dto.username, code.toString());
      await this.mailService.sendVerificationCode(
        dto.username,
        token.toObject().token,
      );
    } else {
      const response = await this.smsService.sendOTP(dto.username);
      if (!(response && response.pinId)) {
        throw new BadRequestException(
          'Sorry we are unable to send you a verification token at this time, please try again later',
        );
      }
      await this.createToken(dto.username, response.pinId);
    }
    // }
    return { message: `A verification code has been sent to ${dto.username}` };
  }

  async createToken(identifier: string, code: string) {
    const token = await this.tokenRepo.findOne({ identifier });
    if (token) {
      await token.remove();
    }
    return this.tokenRepo.create({
      token: code,
      identifier: identifier,
    });
  }

  async updatePersonalDetails(userId: ObjectId | string, dto: UpdateUserDto) {
    await this.userService.update(userId, dto);
    return this.getUserAuthData(await this.userService.findById(userId));
  }

  async createOrganization(userId: string, dto: CreateOrganizationDto) {
    dto.owner = userId;
    const user = await this.userService.findById(userId);
    const organization = await this.organizationService.createOne(dto);
    const role = await this.roleService.getDefaultAdminRole();
    const member = await this.memberService.create({
      organization: organization._id,
      user: userId,
      role: role._id,
      officeTitle: 'Host',
    });
    const _member = member.toObject<Member>();
    this.mailService.welcomeRegisteredUserAndOrganization(user, organization);
    return this.getMemberAuthData(_member);
  }

  async validateOTP(dto: VerifyOtpDto) {
    let userDto: CreateUserDto;
    const usernameIsEmail = isEmail(dto.username);
    // if (!(this.isDevServer == 'true')) {
    if (usernameIsEmail) {
      const token = await this.tokenRepo.findByIdentifier({
        token: dto.otp,
        identifier: dto.username,
      });
      if (!token) {
        throw new BadRequestException(
          `The one time password (OTP) you entered is invalid`,
        );
      }
      await token.remove();
      userDto = { email: dto.username, verifiedEmail: true };
    } else {
      const token = await this.tokenRepo.findByIdentifier({
        identifier: dto.username,
      });
      if (!token) {
        throw new BadRequestException(
          `The one time password (OTP) you entered is invalid`,
        );
      }
      const isVerified = await this.smsService.verifyOTP(
        token.token,
        dto.otp.toString(),
      );
      if (!isVerified) {
        throw new BadRequestException(
          `The one time password (OTP) you entered is invalid`,
        );
      }
      await token.remove();
      userDto = { phone: dto.username, verifiedPhone: isVerified };
    }
    // }
    const [user, isNewUser] = await this.userService.findUpdateOrCreate(
      userDto,
    );
    return this.getUserAuthData(user, isNewUser);
  }

  async getUserAuthData(user: User, isNewUser = false) {
    const organizations = await this.organizationService.repo.find({
      owner: user._id,
    });
    const payload: Partial<TokenData> = {
      username: user.email || user.phone,
      userId: user.id,
    };
    // this access token will be used to access user only routes
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
      user: user,
      organizations,
      isNewUser,
    };
  }

  async setCurrentOrganization(user: string, organization: string) {
    const member = await this.memberService.findByUserOrganization(
      user,
      organization,
    );

    return this.getMemberAuthData(member);
  }

  /** @deprecated No more password login */
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

  /** @deprecated No more password login */
  async loginToOrganization(dto: LoginDto) {
    const member = (this.request as any).user;
    return this.getMemberAuthData(member, dto);
  }

  async getMemberAuthData(member: Member, dto?: LoginDto) {
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

  async findUserOrganizations(username: string): Promise<Organization[]> {
    const user = await this.userService.findByUsername(username);

    return this.organizationService.repo.find({
      owner: user._id,
    });
  }
  /** @deprecated use {@link AuthService.updatePersonalDetails} and {@link AuthService.createOrganization} instead */
  async createNewAccount(dto: CreateAccountDto) {
    const user = (
      await this.userService.findUpdateOrCreate({
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
    this.sendOtpToEmailOrPhone({ username: user.email || user.phone });
    return this.getMemberAuthData(
      await this.memberService.findById(member._id, [
        'organization',
        'user',
        'role',
      ]),
    );
  }

  /** @deprecated Not needed anymore */
  async validateNewUserOTP(memberId: string, dto: VerifyOtpDto) {
    const user = await this.userService.findByUsername(dto.username);
    // if (!(this.isDevServer == 'true')) {
    if (isEmail(dto.username)) {
      const token = await this.tokenRepo.findByIdentifier({
        token: dto.otp,
        identifier: dto.username,
      });
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
    this.mailService.welcomeRegisteredUserAndOrganization(
      user,
      member.organization,
    );
    return this.getMemberAuthData(member);
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

  async declineOrganizationInvite(organization: string, invitation: string) {
    return this.invitationService.declineOrganizationInvite(
      organization,
      invitation,
    );
  }

  async registerMember(organization: string, dto: CreateOneMemberDto) {
    return this.memberService.createOne(organization, dto);
  }
}

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
import { ObjectId } from 'mongoose';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AcceptInvite } from 'src/member/dto/accept-invite.dto';

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
    private memberService: MemberService, // private invitationService: InvitationService,
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
      await this.sendTokenToEmail(dto);
    } else {
      await this.sendTokenToPhone(dto);
    }
    // }
    return { message: `A verification code has been sent to ${dto.username}` };
  }

  private async sendTokenToPhone(dto: VerifyEmailDto) {
    const response = await this.smsService.sendOTP(dto.username);
    if (!(response && response.pinId)) {
      throw new BadRequestException(
        'Sorry we are unable to send you a verification token at this time, please try again later',
      );
    }
    await this.createToken(dto.username, response.pinId);
  }

  private async sendTokenToEmail(dto: VerifyEmailDto) {
    const code = Math.floor(100000 + Math.random() * 900000);
    const token = await this.createToken(dto.username, code.toString());
    await this.mailService.sendVerificationCode(
      dto.username,
      token.toObject().token,
    );
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
    const member: Member = (await this.memberService.create({
      organization: organization._id,
      user: userId,
      role: role._id,
      officeTitle: 'Host',
    })) as Member;
    this.mailService.welcomeRegisteredUserAndOrganization(user, organization);
    return this.getMemberAuthData(member);
  }

  async validateOTP(dto: VerifyOtpDto) {
    let userDto: CreateUserDto;
    const usernameIsEmail = isEmail(dto.username);
    // if (!(this.isDevServer == 'true')) {
    if (usernameIsEmail) {
      userDto = await this.validateEmailOtp(dto);
    } else {
      userDto = await this.validatePhoneOtp(dto);
    }
    // }
    const [user, isNewUser] = await this.userService.findUpdateOrCreate(
      userDto,
    );
    return this.getUserAuthData(user, isNewUser);
  }

  private async validatePhoneOtp(dto: VerifyOtpDto) {
    const token = await this.tokenRepo.findByIdentifier({
      identifier: dto.username,
    });
    if (!token) {
      throw new BadRequestException(
        `The one time password (OTP) you entered is invalid`,
      );
    }
    if (token.verified) {
      throw new BadRequestException(
        `The one time password (OTP) you entered has already been used`,
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
    token.verified = true;
    await token.save();
    return { phone: dto.username, verifiedPhone: isVerified };
  }

  private async validateEmailOtp(dto: VerifyOtpDto) {
    const token = await this.tokenRepo.findByIdentifier({
      token: dto.otp,
      identifier: dto.username,
    });
    if (!token) {
      throw new BadRequestException(
        `The one time password (OTP) you entered is invalid`,
      );
    }
    token.verified = true;
    await token.save();
    return { email: dto.username, verifiedEmail: true };
  }

  async getUserAuthData(user: User, isNewUser = false) {
    const organizations = await this.userService.findUserOrganizations(user.id);
    const payload: Partial<TokenData> = {
      username: user.email || user.phone,
      userId: user.id,
      organizations: organizations.map((org) => org._id),
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
    // fetch user organizations
    const payload: TokenData = {
      username: dto?.username || member.user.email || member.user.phone,
      memberId: member._id,
      organizationId: member.organization?._id ?? member.organization,
      userId: member.user?._id ?? member.user,
      roleId: member.role?._id ?? member.role,
      organizations: [],
    };
    const organizations = await this.userService.findUserOrganizations(
      payload.userId,
    );
    payload.organizations = organizations.map((org) => org._id);
    return {
      accessToken: this.jwtService.sign(payload),
      user: member,
    };
  }

  async findUserOrganizations(username: string): Promise<Organization[]> {
    const user = await this.userService.findByUsername(username);

    return this.userService.findUserOrganizations(user._id);
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
  async validateNewMemberOTP(memberId: string, dto: VerifyOtpDto) {
    let userDto: CreateUserDto;
    const usernameIsEmail = isEmail(dto.username);
    // if (!(this.isDevServer == 'true')) {
    if (usernameIsEmail) {
      userDto = await this.validateEmailOtp(dto);
    } else {
      userDto = await this.validatePhoneOtp(dto);
    }
    // }
    const member = await this.memberService.findById(memberId, [
      'organization',
      'user',
      'role',
    ]);
    const user = await this.userService.update(member.user._id, userDto);
    this.mailService.welcomeRegisteredMember(user, member.organization);
    member.user = user;
    return this.getMemberAuthData(member);
  }

  async validateInvite(invitation: string) {
    return this.memberService.validateInvitation(invitation);
  }

  async acceptOrganizationInvite(invitation: string, dto: AcceptInvite) {
    const member = await this.memberService.acceptInvitation(invitation, dto);
    return this.getMemberAuthData(member);
  }

  async declineOrganizationInvite(invitation: string) {
    return this.memberService.declineInvitation(invitation);
  }

  async registerMember(organization: string, dto: CreateOneMemberDto) {
    const member = await this.memberService.createOne(organization, dto);
    let otpResponse = {};
    if (member.user.verifiedEmail || member.user.verifiedPhone) {
      otpResponse = await this.sendOtpToEmailOrPhone({
        username: member.user.email || member.user.phone,
      });
    }
    return {
      ...otpResponse,
      ...(await this.getMemberAuthData(member)),
    };
  }
}

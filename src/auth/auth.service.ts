import {
  BadRequestException,
  Injectable,
  Scope,
  Inject,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
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
import { CreateOrganizationPasswordDto } from './dto/create-organization-password.dto';
import { ConfigService } from '@nestjs/config';
import { ORGANIZATION_API_HEADER } from './decorators/organization-api.decorator';
import { RoleService } from 'src/role/role.service';
import { TokenData } from './dto/token-data.dto';
import { TokenRequest } from './interfaces/token-request.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { MailService } from 'src/mail/mail.service';
import { SmsService } from 'src/sms/sms.service';
// import { MemberCommonField } from 'src/member-common-field/schemas/member-common-field.schema';
// import { MemberCommonFieldService } from 'src/member-common-field/member-common-field.service';
// import { MembershipPlanService } from 'src/membership-plan/membership-plan.service';
// import { RegisterMember } from './dto/register-member.dto';
// import { SubscriptionService } from 'src/subscription/subscription.service';
// import { SubscriptionStatus } from 'src/subscription/enums/subscription-status.enum';
// import { PlanRenewalDuration } from 'src/membership-plan/enums/plan-renewal-duration';
import { DateTime, Duration } from 'luxon';
import { ObjectId } from 'mongoose';
import { RegisterMember } from './dto/register-member.dto';
import { TokenRepository } from './token.repository';
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private readonly saltRounds = +this.configService.get<number>('SALT_ROUNDS');
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
    private memberService: MemberService, // public memberCommonFieldService: MemberCommonFieldService, // public membershipPlanService: MembershipPlanService, // public subscriptionService: SubscriptionService,
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
    let user;
    // if (!(this.isDevServer == 'true')) {
    if (isEmail(dto.username)) {
      const token = await this.tokenRepo.findOne({
        token: dto.otp.toString(),
        identifier: dto.username,
      });
      if (!token) {
        throw new BadRequestException(
          `The one time password (OTP) you entered is invalid`,
        );
      }
      await token.remove();
      user = await this.userService.findOrCreate({ email: dto.username });
      user.verifiedEmail = true;
    } else {
      this.smsService.verifyOTP(user.phone, dto.otp.toString());
      user = await this.userService.findOrCreate({ phone: dto.username });
      user.verifiedPhone = true;
    }
    // }
    await user.save();
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

  /** @deprecated use this.createNewAccount instead */
  async updatePersonalDetails(userId: ObjectId | string, dto: UpdateUserDto) {
    // TODO: send a welcome Email to user
    return this.userService.update(userId, dto);
  }

  /** @deprecated use this.createNewAccount instead */
  async createOrganization(userId: string, dto: CreateOrganizationPasswordDto) {
    dto.owner = userId;
    const user = await this.userService.findById(userId);
    const organization = await this.organizationService.createOne(dto);
    const role = await this.roleService.getDefaultAdminRole();
    const member = await this.memberService.createOne({
      organization: organization._id,
      user: userId,
      role: role._id,
      password: dto.password,
      officeTitle: dto.officeTitle,
    });
    const _member = member.toObject<Member>();
    this.mailService.welcomeRegisteredOrganization(user, organization);
    return { ..._member, organization, user, role };
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

  async findUserOrganizations(dto: FindUserOrganization) {
    const user = await this.userService.findByUsername(dto.username);

    const member = await (
      await this.memberService.findById(user._id)
    ).populate('organization');
    return member.organization;
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
    const member = await this.memberService.createOne({
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
      const token = await this.tokenRepo.findOne({
        where: { token: dto.otp.toString(), userId: user.id },
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
    await user.save();
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

  async acceptOrganizationInvite() {
    //
  }

  async registerMember(dto: RegisterMember) {
    /*
    const membershipPlan = await this.membershipPlanService.findOne(
      dto.membershipPlanId,
    );
    if (!membershipPlan) {
      throw new BadRequestException('Membership level not found');
    }

    let user = await this.userService.findOrCreateUserByUsername(dto.username);
    user = await this.userService.updateOne(user.id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    const Member = await this.MemberService.createOne(
      new Member({
        userId: user.id,
        organizationId: this.organizationId,
        password: dto.password, // password is hashed in this method.
      }),
    );

    // save all fields that are not default fields
    const bulkDto: MemberCommonField[] = dto.commonFields.map(
      (commonField) =>
        new MemberCommonField({
          ...commonField,
          memberId: Member.id,
          organizationId: this.organizationId,
        }),
    );

    await this.memberCommonFieldService.createMany(bulkDto);

    const currentDt = DateTime.now();
    const endDt = currentDt.plus(
      Duration.fromObject({
        [membershipPlan.renewalDuration]: membershipPlan.renewalDurationCount,
      }),
    );

    this.subscriptionService.createOne({
      organizationId: this.organizationId,
      memberId: Member.id,
      membershipPlanId: membershipPlan.id,
      status: SubscriptionStatus.Pending,
      currentPeriodStart: currentDt.toJSDate(),
      currentPeriodEnd: endDt.toJSDate(),
      cancelAtPeriodEnd: true,
      defaultPaymentMethod: membershipPlan.paymentMethod,
    });

    await Member.reload();
    return Member;
    */
  }
}

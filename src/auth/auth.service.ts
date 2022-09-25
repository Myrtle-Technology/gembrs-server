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
import { Token } from './schemas/token.schema';
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
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  /*
  private readonly saltRounds = +this.configService.get<number>('SALT_ROUNDS');
  private readonly isDevServer: string =
    this.configService.get<string>('IS_DEV_SERVER');
  constructor(
    @Inject(REQUEST) private request: TokenRequest,
    private mailService: MailService,
    private smsService: SmsService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private roleService: RoleService,
    private organizationService: OrganizationService,
    private MemberService: MemberService, // public memberCommonFieldService: MemberCommonFieldService, // public membershipPlanService: MembershipPlanService, // public subscriptionService: SubscriptionService,
  ) {}

  get organizationSlug() {
    return this.request.headers[ORGANIZATION_API_HEADER];
  }

  get organizationId() {
    return this.request.tokenData.organizationId;
  }
  async verifyEmailOrPhone(dto: VerifyEmailDto) {
    const user: User = await this.userService.findOrCreateUserByUsername(
      dto.username,
    );
    if (!(this.isDevServer == 'true')) {
      if (isEmail(dto.username)) {
        const code = Math.floor(100000 + Math.random() * 900000);
        const token = await this.createToken(user, code.toString());
        await this.mailService.sendVerificationCode(user, token.token);
      } else {
        await this.smsService.sendOTP(user.phone);
      }
    }
    return user;
  }

  async createToken(user: User, code: string) {
    const token = await Token.findOne({
      where: { userId: user.id },
    });
    if (token) {
      await token.remove();
    }
    return await Token.create({
      token: code.toString(),
      userId: user.id,
    }).save();
  }

  async validateOTP(dto: VerifyOtpDto) {
    const user = await this.userService.getUserByUsername(dto.username);
    if (!(this.isDevServer == 'true')) {
      if (isEmail(dto.username)) {
        const token = await Token.findOne({
          where: { token: dto.otp.toString(), userId: user.id },
        });
        if (!token) {
          throw new BadRequestException(
            `The one time password (OTP) you entered is invalid`,
          );
        }
        await token.remove();
      } else {
        this.smsService.verifyOTP(user.phone, dto.otp.toString());
      }
    }
    user.verified = true;
    await user.save();
    const payload = {
      username: user.email || user.phone,
      userId: user.id,
    };
    // this access token will be used to access only 4 routes
    // update personal details, create organization, and find User Organizations, create new account
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '24h' }),
      user: user,
    };
  }

  async updatePersonalDetails(userId: ObjectId | string, dto: UpdateUserDto) {
    // TODO: send a welcome Email to user
    return this.userService.update(userId, dto);
  }

  async createOrganization(userId: number, dto: CreateOrganizationPasswordDto) {
    dto.ownerId = userId;
    const user = await this.userService.findOne(userId);
    const organization = await this.organizationService.create(dto);
    const role = await this.roleService.getDefaultAdminRole();
    const member = await this.MemberService.createOne({
      organizationId: organization.id,
      userId: userId,
      roleId: role.id,
      password: dto.password,
      officeTitle: dto.officeTitle,
    });
    delete member.password;
    this.mailService.welcomeRegisteredOrganization(user, organization);
    return { ...member, organization, user, role };
  }

  async validateMember(dto: LoginDto) {
    const user: User = await this.userService.getUserByUsername(dto.username);
    const organizationSlug = this.request.headers[
      ORGANIZATION_API_HEADER
    ] as string;
    if (!organizationSlug) {
      throw new BadRequestException(
        'Please specify the organization you want to login to',
      );
    }

    const organization = await this.organizationService.getOrganizationBySlug(
      organizationSlug,
    );
    if (!organization) {
      throw new NotFoundException(
        `We do not have an organization with the site name "${organizationSlug}"`,
      );
    }

    const member = await Member.findOne({
      where: { userId: user.id, organizationId: organization.id },
    });
    if (!member) {
      throw new UnauthorizedException(
        `You are not a member of this organization, try joining the organization first.`,
      );
    }

    const passwordMatch = await bcrypt.compare(dto.password, member.password);
    if (passwordMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = member;
      return result;
    }
    return null;
  }

  async loginToOrganization(dto: LoginDto) {
    const Member = (this.request as any).user;
    return this.getAuthData(Member, dto);
  }

  async getAuthData(Member: Member, dto?: LoginDto) {
    const payload: TokenData = {
      username: dto?.username || Member.user.email || Member.user.phone,
      memberId: Member.id,
      organizationId: Member.organizationId,
      userId: Member.userId,
      roleId: Member.roleId,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: Member,
    };
  }

  async findUserOrganizations(dto: FindUserOrganization) {
    const user = await this.userService.getUserByUsername(dto.username);

    const orgMember = await this.MemberService.find({
      where: { userId: user.id },
      relations: ['organization'],
    });
    return orgMember.map((om) => om.organization);
  }

  async createNewAccount(userId: number, dto: CreateAccountDto) {
    const user = await this.userService.findOne(userId);
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.email = user.email ?? dto.email;
    user.phone = user.phone ?? dto.phone;
    user.save();
    const organization = await this.organizationService.create({
      contactEmail: user.email,
      name: dto.organizationName,
      slug: dto.organizationSlug,
      contactPhone: user.phone,
    });
    const role = await this.roleService.getDefaultAdminRole();
    const member = await this.MemberService.createOne({
      organizationId: organization.id,
      userId: userId,
      roleId: role.id,
      password: dto.password,
      officeTitle: dto.officeTitle,
      contactPhone: user.phone,
    });
    delete member.password;
    this.mailService.welcomeRegisteredOrganization(user, organization);
    member.user = user;
    member.organization = organization;
    member.role = role;
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

  async registerMember(dto: RegisterMember): Promise<Member> {
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
    *
  }
  */
}

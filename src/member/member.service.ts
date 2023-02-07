import {
  BadRequestException,
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery, ObjectId, ProjectionType, QueryOptions } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SharedService } from 'src/shared/shared.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberPasswordDto } from './dto/update-member-password.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberRepository } from './member.repository';
import { Member } from './schemas/member.schema';
import { PaginationOptions } from 'src/shared/shared.repository';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/services/role.service';
import { CreateOneMemberDto } from './dto/create-one-member.dto';
import { MembershipService } from 'src/membership/membership.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { SubscriptionStatus } from 'src/subscription/enums/subscription-status.enum';
import { RenewalPeriodDuration } from 'src/membership/enums/renewal-period-duration.enum';
import { Membership } from 'src/membership/schemas/membership.schema';
import { MailService } from 'src/mail/mail.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MemberCreatedEvent } from './events/member-created.event';
import { User } from 'src/user/schemas/user.schema';
import { BulkInviteMemberDto } from './dto/bulk-invite-member.dto';
import { MemberStatus } from './enums/member-status.enum';
import { isEmail, isPhoneNumber } from 'class-validator';
import { SmsService } from 'src/sms/sms.service';
import { OrganizationService } from 'src/organization/organization.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { MembershipAccess } from 'src/membership/enums/membership-access.enum';
import { AcceptInvite } from './dto/accept-invite.dto';

@Injectable()
export class MemberService extends SharedService<MemberRepository> {
  private readonly saltRounds = +this.configService.get<number>('SALT_ROUNDS');
  constructor(
    readonly repo: MemberRepository,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly membershipService: MembershipService,
    private readonly organizationService: OrganizationService,
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private readonly eventEmitter: EventEmitter2,
    private configService: ConfigService,
  ) {
    super(repo);
  }

  /**
   * Only use In App, not to be exposed for consumption
   * @param dto {CreateMemberDto}
   * @returns Member
   */
  public async create(dto: CreateMemberDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, this.saltRounds);
    }
    return this.repo.create(dto);
  }

  public async createOne(organization: string, dto: CreateOneMemberDto) {
    const membership = await this.membershipService.findOne(
      organization,
      dto.membership,
    );
    if (!membership) {
      throw new BadRequestException('Membership not found');
    }
    const [user] = await this.userService.findUpdateOrCreate(dto);
    const memberExists = await this.repo.findOne({
      user: user._id,
      organization,
    });
    if (memberExists) {
      throw new BadRequestException(
        'You are already a member of this community',
      );
    }
    const role = await this.roleService.getDefaultMemberRole();
    const subscription = await this.createMemberSubscription(
      membership,
      organization,
      user,
    );
    const member = (await this.create({
      user: user._id,
      organization,
      role: role._id,
      customFields: dto.customFields,
      officeTitle: dto.officeTitle,
      password: dto.password,
      status:
        membership.access == MembershipAccess.APPLICATION
          ? MemberStatus.PENDING
          : MemberStatus.ACCEPTED,
      bio: dto.bio,
      subscription: subscription._id,
    })) as Member;
    this.eventEmitter.emit(
      MemberCreatedEvent.eventName,
      new MemberCreatedEvent(member, true),
    );
    return this.findById(member._id);
  }

  @OnEvent(MemberCreatedEvent.eventName, { async: true })
  protected async handleMemberCreatedEvent({
    member,
    notifyMember,
  }: MemberCreatedEvent) {
    if (notifyMember) {
      await this.mailService.welcomeNewUser(member);
    }
  }

  public async createMemberSubscription(
    membership: Membership,
    organization: string,
    user: User,
  ) {
    const [startDateTime, endDateTime] =
      this.membershipService.getMembershipStartAndEndDate(membership);
    const subscription = await this.subscriptionService.createOne({
      organization: organization,
      user: user._id,
      membership: membership.id,
      status: SubscriptionStatus.Pending,
      currentPeriodStart: startDateTime.toJSDate(),
      currentPeriodEnd: endDateTime?.toJSDate(),
      cancelAtPeriodEnd:
        membership.renewalPeriod.duration !== RenewalPeriodDuration.Never,
      defaultPaymentMethod: membership.paymentMethod,
    });
    return subscription;
  }

  public async findAndPaginate(
    organization: string,
    params: PaginationOptions<Member>,
  ) {
    const defaultFilter = { status: MemberStatus.ACCEPTED };
    params.query = { ...defaultFilter, ...params.query, organization };
    const defaultSort = 'userName';
    params.sort = params.sort || defaultSort;
    return this.repo.paginate(params);
  }
  public async findAll(
    organization: string,
    filter: FilterQuery<Member>,
    projection?: ProjectionType<Member>,
    options?: QueryOptions<Member>,
  ) {
    const defaultFilter = { status: MemberStatus.ACCEPTED };
    return this.repo.find(
      { ...defaultFilter, ...filter, organization },
      projection,
      options,
    );
  }

  public async findById(
    id: ObjectId | string,
    relations = ['user', 'role', 'organization', 'customFields.field'],
  ): Promise<Member> {
    return this.repo.findById(id, { populate: relations });
  }

  public async findOne(
    organizationId: string,
    memberId: string,
    relations: string[] = [
      'role',
      'user',
      'organization',
      'customFields.field',
    ],
  ) {
    return this.repo.findOne(
      { organization: organizationId, _id: memberId },
      {},
      { populate: relations },
    );
  }

  public async findWithPassword(
    organizationId: string,
    userId: string,
    relations: string[] = ['role', 'user'],
  ) {
    return this.repo.findWithPassword(
      {
        organization: organizationId,
        user: userId,
      },
      null,
      { populate: relations },
    );
  }

  public async findByUserOrganization(
    user: string,
    organization: string,
    relations: string[] = ['role', 'user', 'organization'],
  ) {
    return this.repo.findOne({ organization, user }, null, {
      populate: relations,
    });
  }

  public async update(
    organization: string,
    id: ObjectId | string,
    dto: UpdateMemberDto,
  ) {
    delete dto.password;
    return this.repo.updateOne({ organization, _id: id }, dto);
  }

  public async removeById(id: ObjectId | string) {
    return this.repo.deleteById(id);
  }

  public async removeOne(organization: string, id: ObjectId | string) {
    return this.repo.deleteOne({ organization, _id: id });
  }

  public async updatePassword(
    organization: string,
    id: ObjectId | string,
    dto: UpdateMemberPasswordDto,
  ) {
    dto.password = await bcrypt.hash(dto.password, this.saltRounds);
    return this.repo.updateOne(
      { organization, _id: id },
      { password: dto.password },
    );
  }

  public async findAllMemberSubscriptions(
    organization: string,
    memberId: string,
  ) {
    const member = await this.findById(memberId);
    return this.subscriptionService.findAll(organization, {
      user: member.user?._id ?? member.user,
    });
  }

  public async findActiveMemberSubscription(
    organization: string,
    memberId: string,
  ) {
    const member = await this.findOne(organization, memberId, ['subscription']);
    return member.subscription;
  }

  public async inviteMembers(organizationId: string, dto: BulkInviteMemberDto) {
    const role = dto.makeAdmin
      ? await this.roleService.getDefaultAdminRole()
      : await this.roleService.getDefaultMemberRole();
    const organization = await this.organizationService.findById(
      organizationId,
    );
    const bulkDto = dto.usernames.map<CreateMemberDto>((username) => ({
      organization: organizationId,
      membership: dto.membership,
      status: MemberStatus.INVITED,
      userEmail: isEmail(username) ? username : '',
      userPhone: isPhoneNumber(username) ? username : '',
      role: role._id,
      user: null,
    }));

    const members = await this.repo.createManyInvitees(bulkDto);

    const sendEmail = members
      .filter((m) => m.userEmail)
      .map((member) => ({
        name: member.userEmail,
        email: member.userEmail,
        link: this.generateInviteLink(member),
        message: dto.message,
        hostName: `${organization.owner.firstName} ${organization.owner.lastName}`,
        organizationName: organization.name,
      }));
    const sendSMS = members
      .filter((m) => m.userPhone)
      .map((member) => ({
        phone: member.userPhone,
        link: this.generateInviteLink(member),
        message: dto.message,
        hostName: `${organization.owner.firstName} ${organization.owner.lastName}`,
        organizationName: organization.name,
      }));

    const emails = sendEmail.map((dto) =>
      this.mailService.sendMemberInvitationEmail(dto),
    );

    const sms = sendSMS.map((dto) =>
      this.smsService.sendMemberInvitationSMS(dto),
    );

    await Promise.all([...emails, ...sms]);

    return members;
  }

  private generateInviteLink(member: Member) {
    const frontendBaseUrl = this.configService.get<string>('FRONTEND_BASE_URL');

    return `${frontendBaseUrl}/invites/${member._id}`;
  }

  public async validateInvitation(memberId: string) {
    const member = await this.findById(memberId, ['organization', 'role']);
    if (!member) {
      throw new NotFoundException(
        'We could not find the invitation you are looking for',
      );
    }
    if (member.status !== MemberStatus.INVITED) {
      if (member.status === MemberStatus.EXPIRED) {
        throw new BadRequestException('Invitation has expired');
      }
      throw new BadRequestException(
        `This invitation has already been ${member.status}`,
      );
    }
    return member;
  }

  public async acceptInvitation(memberId: string, dto: AcceptInvite) {
    await this.validateInvitation(memberId);
    // create user
    const [user] = await this.userService.findUpdateOrCreate(dto);

    // update member
    const updatedMember = await this.repo.updateOne(
      { _id: memberId },
      {
        user: user._id,
        status: MemberStatus.ACCEPTED,
        userName: user.firstName + ' ' + user.lastName,
      },
    );

    return updatedMember;
  }

  public async declineInvitation(memberId: string) {
    await this.validateInvitation(memberId);

    // update member
    const updatedMember = await this.repo.updateOne(
      { _id: memberId },
      { status: MemberStatus.DECLINED },
    );

    return updatedMember;
  }
}

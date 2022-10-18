import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
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

@Injectable()
export class MemberService extends SharedService<MemberRepository> {
  private readonly saltRounds = +this.configService.get<number>('SALT_ROUNDS');
  constructor(
    readonly repo: MemberRepository,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly membershipService: MembershipService,
    private readonly subscriptionService: SubscriptionService,
    private readonly mailService: MailService,
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
      throw new BadRequestException('Membership level not found');
    }
    const [user] = await this.userService.findOrCreate(dto);
    const role = await this.roleService.getDefaultMemberRole();
    const member = (await this.create({
      user: user._id,
      organization,
      role: role._id,
      customFields: dto.customFields,
      contactPhone: dto.contactPhone,
      officeTitle: dto.officeTitle,
      password: dto.password,
      bio: dto.bio,
    })) as Member;
    await this.createMemberSubscription(membership, organization, member);
    this.eventEmitter.emit(
      MemberCreatedEvent.eventName,
      new MemberCreatedEvent(member, dto.notifyMember),
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
    member: Member,
  ) {
    const [startDateTime, endDateTime] =
      this.membershipService.getMembershipStartAndEndDate(membership);
    return this.subscriptionService.createOne({
      organization: organization,
      member: member._id,
      membership: membership.id,
      status: SubscriptionStatus.Pending,
      currentPeriodStart: startDateTime.toJSDate(),
      currentPeriodEnd: endDateTime.toJSDate(),
      cancelAtPeriodEnd:
        membership.renewalPeriod.duration !== RenewalPeriodDuration.Never,
      defaultPaymentMethod: membership.paymentMethod,
    });
  }

  public async findAll(
    organization: string,
    params: PaginationOptions<Member>,
  ) {
    params.query = { ...params.query, organization };
    return this.repo.paginate(params);
  }

  public async findById(
    id: ObjectId | string,
    relations = ['user', 'role', 'organization'],
  ): Promise<Member> {
    return this.repo.findById(id, { populate: relations });
  }

  public async findOne(
    organizationId: string,
    memberId: string,
    relations: string[] = ['role', 'user'],
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
    member: string,
  ) {
    return this.subscriptionService.findAll(organization, {
      member,
    });
  }

  public async findActiveMemberSubscription(
    organization: string,
    member: string,
  ) {
    return this.subscriptionService.findOne(organization, {
      member,
      active: true,
    });
  }
}

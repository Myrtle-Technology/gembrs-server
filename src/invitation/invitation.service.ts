import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { SharedService } from 'src/shared/shared.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { InvitationRepository } from './invitation.repository';
import { Invitation } from './schemas/invitation.schema';
import { PaginationOptions } from 'src/shared/shared.repository';
import { MailService } from 'src/mail/mail.service';
import { SmsService } from 'src/sms/sms.service';
import { MemberService } from 'src/member/member.service';
import { Member } from 'src/member/schemas/member.schema';
import { InviteMemberDto } from 'src/member/dto/invite-member.dto';
import { RoleService } from 'src/role/services/role.service';
import { UserService } from 'src/user/user.service';
import { InvitationStatus } from './enums/invitation-status.enum';
import { DateTime, Interval } from 'luxon';

@Injectable()
export class InvitationService extends SharedService<InvitationRepository> {
  constructor(
    readonly repo: InvitationRepository,
    private readonly memberService: MemberService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
  ) {
    super(repo);
  }

  public async createOne(dto: CreateInvitationDto) {
    return this.repo.create(dto);
  }

  public async findAll(
    organization: string,
    params: PaginationOptions<Invitation>,
  ) {
    params.query = { ...params.query, organization };
    return this.repo.paginate(params);
  }

  public async findById(
    id: ObjectId | string,
    relations = ['user', 'role'],
  ): Promise<Invitation> {
    return this.repo.findById(id, { populate: relations });
  }

  public async findOne(
    organizationId: string,
    invitationId: string,
    relations: string[] = ['organization', 'member'],
  ) {
    return this.repo.findOne(
      { organization: organizationId, _id: invitationId },
      {},
      { populate: relations },
    );
  }

  public async update(
    organization: string,
    id: ObjectId | string,
    dto: UpdateInvitationDto,
  ) {
    return this.repo.updateOne({ organization, _id: id }, dto);
  }

  public async removeById(id: ObjectId | string) {
    return this.repo.deleteById(id);
  }

  public async removeOne(organization: string, id: ObjectId | string) {
    return this.repo.deleteOne({ organization, _id: id });
  }

  async declineOrganizationInvite(organization: string, _invitation: string) {
    // get invite object
    const invitation = await this.repo.findOne({
      _id: _invitation,
      organization,
    });
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    this.update(organization, invitation._id, {
      status: InvitationStatus.Declined,
    });
  }
  async acceptOrganizationInvite(organization: string, _invitation: string) {
    // get invite object
    const invitation = await this.repo.findOne({
      _id: _invitation,
      organization,
    });
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    if (invitation.status !== InvitationStatus.Pending) {
      throw new BadRequestException(
        `Sorry the Invitation status is now: '${invitation.status}', we can't accept the invitation any more`,
      );
    }
    // check if invitation has expired
    const expiresAt = DateTime.fromJSDate(invitation.expiresAt);
    const today = DateTime.now();
    const difference = Interval.fromDateTimes(today, expiresAt).count('days');
    if (difference <= 0) {
      await this.update(organization, invitation._id, {
        status: InvitationStatus.Expired,
      });
      throw new BadRequestException(
        `Sorry the Invitation status is now: '${invitation.status}', we can't accept the invitation any more`,
      );
    }
    // create member
    const member = (await this.memberService.create({
      organization: organization,
      role: invitation.role._id ?? invitation.role,
      user: invitation.user._id ?? invitation.user,
    })) as Member;
    // create subscription
    await this.memberService.createMemberSubscription(
      invitation.membership,
      organization,
      member,
    );
    await this.update(organization, invitation._id, {
      status: InvitationStatus.Accepted,
    });
    return this.memberService.findById(member._id);
  }

  public async sendInviteEmailOrSMS(
    _invitation: string,
    serverBaseUrl: string,
  ) {
    const invitation = await this.repo.findById(_invitation, {
      populate: ['role', 'organization', 'user', 'membership'],
    });
    // generate short link to invitation
    const shortLink = this.generateInviteLink(invitation, serverBaseUrl);
    if (invitation.user.email) {
      await this.mailService.sendMemberInviteEmail(invitation, shortLink);
    } else {
      // send text message
      await this.smsService.sendMemberInviteSMS(invitation, shortLink);
    }
    return invitation;
  }

  private generateInviteLink(invitation: Invitation, serverBaseUrl: string) {
    const { _id, organization } = invitation;
    const link = `${serverBaseUrl}/invitations/${
      organization?._id || organization
    }/${_id}`;
    return link;
  }

  public async inviteMember(
    organization: string,
    dto: InviteMemberDto,
    serverBaseUrl: string,
  ) {
    const [user] = await this.userService.findUpdateOrCreate(dto);
    const role = await this.roleService.getDefaultMemberRole();
    const invitation = await this.createOne({
      user: user._id,
      role: role._id,
      organization: organization,
      membership: dto.membership,
    });
    return this.sendInviteEmailOrSMS(invitation.id, serverBaseUrl);
  }
}

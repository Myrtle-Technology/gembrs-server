import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { SharedService } from 'src/shared/shared.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { InvitationRepository } from './invitation.repository';
import { Invitation } from './schemas/invitation.schema';
import { PaginationOptions } from 'src/shared/shared.repository';
import { MailService } from 'src/mail/mail.service';
import { SmsService } from 'src/sms/sms.service';
import { getSeverBaseUrl } from 'src/shared/helpers/get-server-base-url.helper';

@Injectable()
export class InvitationService extends SharedService<InvitationRepository> {
  constructor(
    readonly repo: InvitationRepository,
    readonly mailService: MailService,
    readonly smsService: SmsService,
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

  public async sendInviteEmailOrSMS(_invitation: string, baseUrl: string) {
    const invitation = await this.repo.findById(_invitation, {
      populate: ['member', 'organization', 'member.role', 'member.user'],
    });
    // generate short link to invitation
    const shortLink = this.generateInviteLink(invitation, baseUrl);
    if (invitation.user.email) {
      await this.mailService.sendMemberInviteEmail(invitation, shortLink);
    } else {
      // send text message
      await this.smsService.sendMemberInviteSMS(invitation, shortLink);
    }
    return invitation;
  }

  generateInviteLink(invitation: Invitation, baseUrl: string) {
    const { _id, organization } = invitation;
    const shortLink = `${baseUrl}/invitations/${
      organization?._id || organization
    }/${_id}`;
    return shortLink;
  }
}

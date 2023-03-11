import { DeliveryChannel } from './enums/delivery-channel.enum';
import { SharedRepository } from 'src/shared/shared.repository';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';
import { Recipient } from './schemas/recipient.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { UpdateCampaignRecipientDto } from './dto/update-campaign.dto';
import { Member } from 'src/member/schemas/member.schema';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class RecipientRepository extends SharedRepository<
  Recipient,
  CreateRecipientDto,
  UpdateRecipientDto
> {
  constructor(
    @InjectModel(Recipient.name) model: Model<Recipient>,
    @InjectModel(Member.name) readonly memberModel: Model<Member>,
    @InjectModel(User.name) readonly userModel: Model<User>,
  ) {
    super(model);
  }

  protected populateOnFind = ['user'];

  public async find(
    filter: FilterQuery<Recipient>,
    projection?: ProjectionType<Recipient>,
    options?: QueryOptions<Recipient>,
  ) {
    return this.model
      .find(filter, projection, options)
      .populate(this.populateOnFind)
      .exec();
  }

  public async decipherRecipients(
    campaign: string,
    recipients: UpdateCampaignRecipientDto[],
  ): Promise<string[]> {
    const organizationRecipients = recipients
      .filter((r) => r.type === 'organization')
      .map((r) => r.id);

    const organizationUsers = await this.getOrganizationUsers(
      organizationRecipients,
    );

    const userRecipients = recipients
      .filter((r) => r.type === 'user')
      .map((r) => r.id);

    const userIds = [...userRecipients, ...organizationUsers];

    const users = await this.getNewUsers(userIds);

    const newRecipients = await this.createNewRecipients(campaign, users);

    return newRecipients.map((r) => r._id);
  }

  private async getOrganizationUsers(
    organizationRecipients: string[],
  ): Promise<string[]> {
    const members = await this.memberModel
      .find({ organization: { $in: organizationRecipients } })
      .populate('user')
      .exec();
    return members.map((m) => m.user._id);
  }

  private async getNewUsers(userIds: string[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }

  private async createNewRecipients(
    campaign: string,
    users: User[],
  ): Promise<any> {
    const newRecipients = users.flatMap((user) => {
      const rs = [];
      if (user.email) {
        rs.push({
          campaign,
          user: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          channel: DeliveryChannel.EMAIL,
        });
      }
      if (user.phone) {
        rs.push({
          campaign,
          user: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          channel: DeliveryChannel.SMS,
        });
      }
      return rs;
    });

    const existingRecipients = await this.model.find({
      $or: newRecipients.map(({ user, channel }) => ({ user, channel })),
    });

    const newRecipientsToCreate = newRecipients.filter(
      (newRecipient) =>
        !existingRecipients.some(
          (existingRecipient) =>
            existingRecipient.user === newRecipient.user &&
            existingRecipient.channel === newRecipient.channel,
        ),
    );

    const newRecipientsDocs = await this.model.insertMany(
      newRecipientsToCreate,
      {},
    );

    return newRecipientsDocs;
  }
}

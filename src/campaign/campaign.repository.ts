import { SharedRepository } from 'src/shared/shared.repository';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './schemas/campaign.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

@Injectable()
export class CampaignRepository extends SharedRepository<
  Campaign,
  CreateCampaignDto,
  UpdateCampaignDto
> {
  constructor(@InjectModel(Campaign.name) model: Model<Campaign>) {
    super(model);
  }

  protected populateOnFind = ['template'];

  public async find(
    filter: FilterQuery<Campaign>,
    projection?: ProjectionType<Campaign>,
    options?: QueryOptions<Campaign>,
  ) {
    return this.model
      .find(filter, projection, options)
      .populate(this.populateOnFind)
      .exec();
  }

  public async updateOne(
    filter: FilterQuery<Campaign>,
    dto: UpdateCampaignDto,
    options?: QueryOptions<Campaign>,
  ): Promise<Campaign> {
    return this.model.findOneAndUpdate(
      filter,
      {
        title: dto.title,
        dummyRecipients: dto.dummyRecipients,
        status: dto.status,
        scheduledAt: dto.scheduledAt,
        $addToSet: { recipients: { $each: dto.recipients || [] } },
      },
      {
        new: true,
        ...options,
        populate: this.populateOnFind,
      },
    );
  }

  public async removeRecipients(
    userId: string,
    campaignId: string,
    recipientIds: string[],
  ) {
    return this.model.updateOne(
      { createdBy: userId, _id: campaignId },
      { $pullAll: { recipients: recipientIds || [] } },
    );
  }
}

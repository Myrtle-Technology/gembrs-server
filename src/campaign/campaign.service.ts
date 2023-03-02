import { RecipientRepository } from './recipient.repository';
import { TemplateRepository } from './template.repository';
import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { SharedService } from 'src/shared/shared.service';
import { CampaignRepository } from './campaign.repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { CampaignStatus } from './enums/campaign-status.enum';
import { Campaign } from './schemas/campaign.schema';
import { PaginationOptions } from 'src/shared/shared.repository';
import { FilterQuery, ObjectId, ProjectionType, QueryOptions } from 'mongoose';
import { UpdateCampaignTemplateSmsDto } from './dto/update-campaign-template-sms.dto';

@Injectable()
export class CampaignService extends SharedService<CampaignRepository> {
  constructor(
    readonly repo: CampaignRepository,
    readonly templateRepo: TemplateRepository,
    readonly recipientRepo: RecipientRepository,
  ) {
    super(repo);
  }

  public async findAndPaginate(
    userId: string,
    params: PaginationOptions<Campaign>,
  ) {
    const defaultFilter = {
      status: { $in: [CampaignStatus.SCHEDULED, CampaignStatus.SENT] },
    };
    params.query = { ...defaultFilter, ...params.query, createdBy: userId };
    const defaultSort = 'createdAt';
    params.sort = params.sort || defaultSort;
    return this.repo.paginate(params);
  }

  public async findAll(
    userId: string,
    filter: FilterQuery<Campaign>,
    projection?: ProjectionType<Campaign>,
    options?: QueryOptions<Campaign>,
  ) {
    const defaultFilter = { status: CampaignStatus.DRAFT };
    return this.repo.find(
      { ...defaultFilter, ...filter, createdBy: userId },
      projection,
      options,
    );
  }

  public async findById(
    userId: string,
    id: ObjectId | string,
    relations = ['template'],
  ): Promise<Campaign> {
    return this.repo.findOne({ _id: id, createdBy: userId }, null, {
      populate: relations,
    });
  }

  public async createCampaign(userId: string, dto: CreateTemplateDto) {
    const template = await this.templateRepo.create(dto);
    const campaignDto: CreateCampaignDto = {
      title: dto.title,
      template: template._id,
      status: CampaignStatus.DRAFT,
      createdBy: userId,
    };
    return this.repo.create(campaignDto);
  }

  public async updateCampaignSms(
    userId: string,
    campaignId: string,
    dto: UpdateCampaignTemplateSmsDto,
  ) {
    const campaign = await this.findById(userId, campaignId);
    await this.templateRepo.updateOne(campaign.template, dto);
    return this.findById(userId, campaignId);
  }

  public async updateCampaign(
    userId: string,
    campaignId: string,
    dto: UpdateCampaignDto,
  ) {
    return this.repo.updateOne({ _id: campaignId, createdBy: userId }, dto);
  }

  public async updateAndSendCampaign(
    userId: string,
    campaignId: string,
    dto: UpdateCampaignDto,
  ) {
    const campaign = await this.updateCampaign(userId, campaignId, dto);
    // const recipients = await this.recipientRepo.find({});
    // if ()
    if (campaign.scheduledAt) {
      // Schedule
    } else {
      // send
    }

    return campaign;
  }

  public async removeById(id: ObjectId | string) {
    return this.repo.deleteById(id);
  }

  public async removeOne(organization: string, id: ObjectId | string) {
    return this.repo.deleteOne({ organization, _id: id });
  }
}

import { SmsService } from './../sms/sms.service';
import { MailService } from 'src/mail/mail.service';
import { RecipientRepository } from './recipient.repository';
import { TemplateRepository } from './template.repository';
import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import {
  UpdateCampaignDto,
  UpdateCampaignRecipientDto,
} from './dto/update-campaign.dto';
import { SharedService } from 'src/shared/shared.service';
import { CampaignRepository } from './campaign.repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { CampaignStatus } from './enums/campaign-status.enum';
import { Campaign } from './schemas/campaign.schema';
import { PaginationOptions } from 'src/shared/shared.repository';
import { FilterQuery, ObjectId, ProjectionType, QueryOptions } from 'mongoose';
import { UpdateCampaignTemplateSmsDto } from './dto/update-campaign-template-sms.dto';
import { CronJob } from 'cron';
import { DateTime } from 'luxon';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as EditorjsParser from 'editorjs-parser';
import { convert as covertHTMLtoText } from 'html-to-text';
import { Recipient } from './schemas/recipient.schema';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

@Injectable()
export class CampaignService extends SharedService<CampaignRepository> {
  constructor(
    readonly repo: CampaignRepository,
    private readonly templateRepo: TemplateRepository,
    private readonly recipientRepo: RecipientRepository,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private readonly schedulerRegistry: SchedulerRegistry,
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
    const campaign = this.repo.findOne({ _id: id, createdBy: userId }, null, {
      populate: relations,
    });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    return campaign;
  }

  public async createCampaign(userId: string, dto: CreateTemplateDto) {
    const template = await this.createTemplate(dto);
    const campaignDto: CreateCampaignDto = {
      title: dto.title,
      template: template._id,
      status: CampaignStatus.DRAFT,
      createdBy: userId,
    };
    return this.repo.create(campaignDto);
  }

  private async createTemplate(dto: CreateTemplateDto) {
    const parser = new EditorjsParser();
    const template = await this.templateRepo.create(dto);
    // TODO generate template email and sms strings
    const html = parser.parse(dto.content);
    return this.templateRepo.updateOne(
      { _id: template._id },
      {
        emailTemplate: html, // convert template.content to html
        smsTemplate: covertHTMLtoText(html), // convert to plain text.
      },
    );
  }

  private async updateTemplate(templateId: string, dto: UpdateCampaignDto) {
    const parser = new EditorjsParser();
    // TODO generate template email and sms strings
    const html = parser.parse(dto.template);
    return this.templateRepo.updateOne(
      { _id: templateId },
      {
        content: dto.template,
        emailTemplate: html,
        smsTemplate: covertHTMLtoText(html),
      },
    );
  }

  public async updateCampaignSms(
    userId: string,
    campaignId: string,
    dto: UpdateCampaignTemplateSmsDto,
  ) {
    const campaign = await this.findById(userId, campaignId);
    await this.templateRepo.updateOne(
      campaign.template?._id ?? campaign.template,
      dto,
    );
    return this.findById(userId, campaignId);
  }

  public async updateCampaign(
    userId: string,
    campaignId: string,
    dto: UpdateCampaignDto,
  ) {
    const recipients = await this.recipientRepo.decipherRecipients(
      campaignId,
      dto.dummyRecipients,
    );
    if (dto.template) {
      await this.updateTemplate(campaignId, dto.template);
    }
    return this.repo.updateOne(
      { _id: campaignId, createdBy: userId },
      {
        ...dto,
        recipients,
      },
    );
  }

  public async removeCampaignRecipients(
    userId: string,
    campaignId: string,
    recipientIds: string[],
  ) {
    const campaign = await this.repo.removeRecipients(
      userId,
      campaignId,
      recipientIds,
    );
    await this.recipientRepo.deleteOne({ _id: { $in: recipientIds } });
    return campaign;
  }

  public async updateAndSendCampaign(
    userId: string,
    campaignId: string,
    dto: UpdateCampaignDto,
  ) {
    const campaign = await this.updateCampaign(userId, campaignId, dto);
    let status = CampaignStatus.SENT;
    if (campaign.scheduledAt) {
      // Schedule
      this.scheduleCampaign(userId, campaign);
      status = CampaignStatus.SCHEDULED;
    } else {
      await this.sendCampaign(userId, campaign);
    }
    return this.repo.updateOne(
      { _id: campaign._id, createdBy: userId },
      {
        status: status,
      },
    );
  }

  public async sendCampaign(userId: string, campaignId: Campaign) {
    const campaign =
      typeof campaignId === 'string'
        ? await this.findById(userId, campaignId)
        : campaignId;
    const recipients = await this.recipientRepo.find({
      campaign: campaign._id,
    });

    this.mailService.sendMail({
      template: campaign.template.emailTemplate,
      recipients,
    });

    this.smsService.sendBulkSMS({
      template: campaign.template.smsTemplate,
      recipients,
    });
  }

  public scheduleCampaign(userId: string, campaign: Campaign) {
    const date = DateTime.fromISO(
      campaign.scheduledAt as unknown as string,
    ).toJSDate();
    const job = new CronJob(
      date,
      async () => {
        await this.sendCampaign(userId, campaign._id);
      },
      () => {
        console.log('Campaign Schedule Job completed');
      },
    );

    this.schedulerRegistry.addCronJob(`${Date.now()}-${campaign.title}`, job);
    job.start();
  }

  public cancelAllScheduledCampaigns() {
    this.schedulerRegistry.getCronJobs().forEach((job) => {
      job.stop();
    });
  }

  public async removeById(id: ObjectId | string) {
    return this.repo.deleteById(id);
  }

  public async removeOne(organization: string, id: ObjectId | string) {
    return this.repo.deleteOne({ organization, _id: id });
  }

  public async removeMany(organization: string, ids: Array<ObjectId | string>) {
    return this.repo.deleteOne({ organization, _id: { $in: ids } });
  }
}

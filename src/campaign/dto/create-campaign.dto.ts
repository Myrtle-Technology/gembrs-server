import { CampaignStatus } from '../enums/campaign-status.enum';

export class CreateCampaignDto {
  title: string;

  status: CampaignStatus; // draft, scheduled, sent, etc.

  template: Record<string, unknown>;

  createdBy: string;
}

import { PartialType } from '@nestjs/swagger';
import { CreateCampaignDto } from './create-campaign.dto';

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  scheduledAt?: Date;
  dummyRecipients?: UpdateCampaignRecipientDto[];
  recipients?: string[];
}

export class UpdateCampaignRecipientDto {
  type: 'organization' | 'user';
  id: string; // organizationId or userId
}

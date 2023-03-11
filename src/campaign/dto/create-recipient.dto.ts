import { DeliveryChannel } from '../enums/delivery-channel.enum';
import { DeliveryStatus } from '../enums/delivery-status.enum';

export class CreateRecipientDto {
  user: string;

  campaign: string;

  email: string;

  phone: string;

  channel: DeliveryChannel; // sms, email, push, etc.

  status?: DeliveryStatus; // sent, failed, etc.

  message?: string;

  error?: string;

  sentAt?: Date;

  deliveredAt?: Date;

  metadata?: Record<string, unknown>;
}

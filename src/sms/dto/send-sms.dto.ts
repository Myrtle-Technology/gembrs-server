import { Recipient } from '../../campaign/schemas/recipient.schema';
export class SendSmsDto {
  template: string;
  recipients: Recipient[];
}

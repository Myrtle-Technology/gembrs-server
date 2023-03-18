import { Recipient } from './../../campaign/schemas/recipient.schema';
export class SendMailDto {
  template: string;
  recipients: Recipient[];
  // schedule: string;
}

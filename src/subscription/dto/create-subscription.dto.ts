import { PaymentMethod } from 'src/membership/enums/payment-method.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

export class CreateSubscriptionDto {
  organization: string;
  member: string;
  membership: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  defaultPaymentMethod: PaymentMethod;
}

import { SharedRepository } from 'src/shared/shared.repository';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './schemas/subscription.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SubscriptionRepository extends SharedRepository<
  Subscription,
  CreateSubscriptionDto,
  UpdateSubscriptionDto
> {
  constructor(@InjectModel(Subscription.name) model: Model<Subscription>) {
    super(model);
  }

  protected populateOnFind = ['organization', 'member', 'membership'];
}

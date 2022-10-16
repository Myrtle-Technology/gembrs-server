import { Injectable } from '@nestjs/common';
import { FilterQuery, ObjectId } from 'mongoose';
import { PaginationOptions } from 'mongoose-paginate-ts';
import { SharedService } from 'src/shared/shared.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './schemas/subscription.schema';
import { SubscriptionRepository } from './subscription.repository';

@Injectable()
export class SubscriptionService extends SharedService<SubscriptionRepository> {
  constructor(readonly repo: SubscriptionRepository) {
    super(repo);
  }

  public async createOne(dto: CreateSubscriptionDto) {
    return this.repo.create(dto);
  }

  public async paginate(organization: string, params: PaginationOptions) {
    params.query = { ...params.query, organization };
    return this.repo.paginate(params);
  }

  public async findAll(
    organization: string,
    filter: FilterQuery<Subscription>,
  ) {
    return this.repo.find({ ...filter, organization });
  }

  public async findById(
    id: ObjectId | string,
    relations = ['organization', 'member', 'membership'],
  ): Promise<Subscription> {
    return this.repo.findById(id, { populate: relations });
  }

  public async findOne(
    organization: string,
    filter: FilterQuery<Subscription>,
    relations: string[] = ['organization', 'member', 'membership'],
  ) {
    return this.repo.findOne(
      { ...filter, organization: organization },
      {},
      { populate: relations },
    );
  }

  public async update(
    organization: string,
    id: ObjectId | string,
    dto: UpdateSubscriptionDto,
  ) {
    return this.repo.updateOne({ organization, _id: id }, dto);
  }

  public async removeById(id: ObjectId | string) {
    return this.repo.deleteById(id);
  }

  public async removeOne(organization: string, id: ObjectId | string) {
    return this.repo.deleteOne({ organization, _id: id });
  }
}

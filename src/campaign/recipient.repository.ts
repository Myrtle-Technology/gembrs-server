import { SharedRepository } from 'src/shared/shared.repository';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';
import { Recipient } from './schemas/recipient.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

@Injectable()
export class RecipientRepository extends SharedRepository<
  Recipient,
  CreateRecipientDto,
  UpdateRecipientDto
> {
  constructor(@InjectModel(Recipient.name) model: Model<Recipient>) {
    super(model);
  }

  protected populateOnFind = ['user', 'organization'];

  public async find(
    filter: FilterQuery<Recipient>,
    projection?: ProjectionType<Recipient>,
    options?: QueryOptions<Recipient>,
  ) {
    return this.model
      .find(filter, projection, options)
      .populate(this.populateOnFind)
      .exec();
  }
}

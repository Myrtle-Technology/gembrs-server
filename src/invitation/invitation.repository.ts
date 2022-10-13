import { SharedRepository } from 'src/shared/shared.repository';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { Invitation } from './schemas/invitation.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

@Injectable()
export class InvitationRepository extends SharedRepository<
  Invitation,
  CreateInvitationDto,
  UpdateInvitationDto
> {
  constructor(@InjectModel(Invitation.name) model: Model<Invitation>) {
    super(model);
  }

  protected populateOnFind = ['organization', 'member'];

  public async find(
    filter: FilterQuery<Invitation>,
    projection?: ProjectionType<Invitation>,
    options?: QueryOptions<Invitation>,
  ) {
    return this.model
      .find(filter, projection, options)
      .populate(this.populateOnFind)
      .exec();
  }

  public async findWithPassword(
    filter?: FilterQuery<Invitation>,
    projection?: ProjectionType<Invitation> | null,
    options?: QueryOptions<Invitation> | null,
  ) {
    return this.model
      .findOne(filter, projection, {
        populate: this.populateOnFind,
        ...options,
      })
      .select('+password')
      .exec();
  }
}

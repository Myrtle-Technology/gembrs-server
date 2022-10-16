import { SharedRepository } from 'src/shared/shared.repository';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './schemas/membership.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MembershipRepository extends SharedRepository<
  Membership,
  CreateMembershipDto,
  UpdateMembershipDto
> {
  constructor(@InjectModel(Membership.name) model: Model<Membership>) {
    super(model);
  }

  protected populateOnFind = ['changeableTo'];
}

import { SharedRepository } from 'src/shared/shared.repository';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './schemas/member.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  HydratedDocument,
  Model,
  ProjectionType,
  QueryOptions,
} from 'mongoose';

@Injectable()
export class MemberRepository extends SharedRepository<
  Member,
  CreateMemberDto,
  UpdateMemberDto
> {
  constructor(@InjectModel(Member.name) model: Model<Member>) {
    super(model);
  }

  populateOnFind = ['user', 'role'];

  public async find(options?: any) {
    return this.model.find(options).exec();
  }

  public async findWithPassword(
    filter?: FilterQuery<Member>,
    projection?: ProjectionType<Member> | null,
    options?: QueryOptions<Member> | null,
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

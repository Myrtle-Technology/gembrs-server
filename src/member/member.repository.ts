import { SharedRepository } from 'src/shared/shared.repository';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './schemas/member.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MemberRepository extends SharedRepository<
  Member,
  CreateMemberDto,
  UpdateMemberDto
> {
  constructor(@InjectModel(Member.name) model: Model<Member>) {
    super(model);
  }
}

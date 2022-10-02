import { Injectable } from '@nestjs/common';
import { ObjectId, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SharedService } from 'src/shared/shared.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipRepository } from './membership.repository';
import { Membership } from './schemas/membership.schema';

@Injectable()
export class MembershipService extends SharedService<MembershipRepository> {
  constructor(readonly repo: MembershipRepository) {
    super(repo);
  }

  public async createOne(dto: CreateMembershipDto) {
    return this.repo.create(dto);
  }

  public async findAll(organization: string, filter?: any) {
    return this.repo.find({ ...filter, organization });
  }

  public async findOne(organization: string, id: string) {
    return this.repo.findOne({ organization, _id: id });
  }

  public async updateOne(
    organization: string,
    id: ObjectId | string,
    dto: UpdateMembershipDto,
  ) {
    return this.repo.updateOne({ organization, _id: id }, dto);
  }

  public async removeOne(organization: string, id: ObjectId | string) {
    return this.repo.deleteOne({ organization, _id: id });
  }
}

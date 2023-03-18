import { SharedRepository } from 'src/shared/shared.repository';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './schemas/member.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { isEmail } from 'class-validator';
import { MemberStatus } from './enums/member-status.enum';

@Injectable()
export class MemberRepository extends SharedRepository<
  Member,
  CreateMemberDto,
  UpdateMemberDto
> {
  constructor(@InjectModel(Member.name) model: Model<Member>) {
    super(model);
  }

  protected populateOnFind = [
    'user',
    'role',
    'organization',
    'customFields.field',
  ];
  protected excludedFields = ['password'];

  public async createManyInvitees(bulkDto: CreateMemberDto[]) {
    const members = await this.model.find({
      $or: bulkDto.map((d) =>
        isEmail(d.userEmail)
          ? { userEmail: d.userEmail, organization: d.organization }
          : { phone: d.userPhone, organization: d.organization },
      ),
    });
    const membersFound = members.map((u) => u.userEmail || u.userPhone);
    const membersToCreate = bulkDto.filter(
      (d) => !membersFound.includes(d.userEmail || d.userPhone),
    );
    const createdMembers = await this.model.insertMany(membersToCreate);
    // separate members with status == 'accepted' we don't want to send invites to them again
    const unacceptedMembers = members.filter(
      (m) => m.status !== MemberStatus.ACCEPTED,
    );
    // bulk update unaccepted member to have status = 'pending'
    this.model.updateMany(
      { _id: { $in: unacceptedMembers.map((m) => m._id) } },
      { status: MemberStatus.INVITED },
    );
    return [...unacceptedMembers, ...createdMembers];
  }

  public async find(
    filter: FilterQuery<Member>,
    projection?: ProjectionType<Member>,
    options?: QueryOptions<Member>,
  ) {
    return this.model
      .find(filter, projection, options)
      .populate(this.populateOnFind)
      .exec();
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

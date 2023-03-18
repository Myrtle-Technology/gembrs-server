import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { SharedService } from 'src/shared/shared.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipRepository } from './membership.repository';
import { DateTime, Duration } from 'luxon';
import { Membership } from './schemas/membership.schema';
import { RenewalPeriodDuration } from './enums/renewal-period-duration.enum';
import { PaginationOptions } from 'src/shared/shared.repository';

@Injectable()
export class MembershipService extends SharedService<MembershipRepository> {
  constructor(readonly repo: MembershipRepository) {
    super(repo);
  }

  public async createOne(organization: string, dto: CreateMembershipDto) {
    dto.organization = organization;
    return this.repo.create(dto);
  }

  public async paginate(
    organization: string,
    params: PaginationOptions<Membership>,
  ) {
    params.query = { ...params.query, organization };
    return this.repo.paginate(params);
  }

  public async findAll(organization: string, filter?: any) {
    return this.repo.find({ ...filter, organization });
  }

  public async findById(organization: string, id: string) {
    return this.repo.findOne({ organization, _id: id });
  }

  public async findOne(organization: string, filter: any) {
    return this.repo.findOne({ organization, ...filter });
  }

  public async updateOne(
    organization: string,
    id: ObjectId | string,
    dto: UpdateMembershipDto,
  ) {
    dto.organization = organization;
    return this.repo.updateOne({ organization, _id: id }, dto);
  }

  public async removeOne(organization: string, id: ObjectId | string) {
    return this.repo.deleteOne({ organization, _id: id });
  }

  public getMembershipStartAndEndDate(membership: Membership) {
    const startDateTime = DateTime.now();
    let endDateTime: DateTime | null = null;
    if (membership.renewalPeriod.duration !== RenewalPeriodDuration.Never) {
      endDateTime = startDateTime.plus(
        Duration.fromObject({
          [membership.renewalPeriod.duration]: membership.renewalPeriod.length,
        }),
      );
    }

    return [startDateTime, endDateTime];
  }
}

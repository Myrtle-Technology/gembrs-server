import { Injectable } from '@nestjs/common';
import { ObjectId, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SharedService } from 'src/shared/shared.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberPasswordDto } from './dto/update-member-password.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberRepository } from './member.repository';
import { InviteMemberDto } from './dto/invite-member.dto';
import { Member } from './schemas/member.schema';
import { PaginationOptions } from 'src/shared/shared.repository';

@Injectable()
export class MemberService extends SharedService<MemberRepository> {
  private readonly saltRounds = +this.configService.get<number>('SALT_ROUNDS');
  constructor(
    readonly repo: MemberRepository,
    private configService: ConfigService,
  ) {
    super(repo);
  }

  public async createOne(dto: CreateMemberDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, this.saltRounds);
    }
    return this.repo.create(dto);
  }

  public async findAll(
    organization: string,
    params: PaginationOptions<Member>,
  ) {
    params.query = { ...params.query, organization };
    return this.repo.paginate(params);
  }

  public async findById(
    id: ObjectId | string,
    relations = ['user', 'role'],
  ): Promise<Member> {
    return this.repo.findById(id, { populate: relations });
  }

  public async findOne(
    organizationId: string,
    memberId: string,
    relations: string[] = ['role', 'user'],
  ) {
    return this.repo.findOne(
      { organization: organizationId, _id: memberId },
      {},
      { populate: relations },
    );
  }

  public async findWithPassword(
    organizationId: string,
    userId: string,
    relations: string[] = ['role', 'user'],
  ) {
    return this.repo.findWithPassword(
      {
        organization: organizationId,
        user: userId,
      },
      null,
      { populate: relations },
    );
  }

  public async update(
    organization: string,
    id: ObjectId | string,
    dto: UpdateMemberDto,
  ) {
    delete dto.password;
    return this.repo.updateOne({ organization, _id: id }, dto);
  }

  public async removeById(id: ObjectId | string) {
    return this.repo.deleteById(id);
  }

  public async removeOne(organization: string, id: ObjectId | string) {
    return this.repo.deleteOne({ organization, _id: id });
  }

  public async updatePassword(
    organization: string,
    id: ObjectId | string,
    dto: UpdateMemberPasswordDto,
  ) {
    dto.password = await bcrypt.hash(dto.password, this.saltRounds);
    return this.repo.updateOne(
      { organization, _id: id },
      { password: dto.password },
    );
  }

  public async inviteMember(dto: InviteMemberDto) {
    // create a new user
    // create new subscription to a membership plan
    // get member Role
    // create a member without password
    // create invitation
    // send member an invite email
    return this.repo.create(dto as any);
  }
}

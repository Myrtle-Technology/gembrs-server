import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SharedService } from 'src/shared/shared.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberPasswordDto } from './dto/update-member-password.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberRepository } from './member.repository';
import { InviteMemberDto } from './dto/invite-member.dto';

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

  public async findAll(filter?: any) {
    return this.repo.find();
  }

  public async findById(id: ObjectId | string) {
    return this.repo.findById(id);
  }

  public async update(id: ObjectId | string, dto: UpdateMemberDto) {
    delete dto.password;
    return this.repo.update(id, dto);
  }

  public async remove(id: ObjectId | string) {
    return this.repo.delete(id);
  }

  public async updatePassword(
    id: ObjectId | string,
    dto: UpdateMemberPasswordDto,
  ) {
    dto.password = await bcrypt.hash(dto.password, this.saltRounds);
    return this.repo.update(id, { password: dto.password });
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

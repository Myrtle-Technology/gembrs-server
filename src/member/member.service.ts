import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { SharedService } from 'src/shared/shared.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberPasswordDto } from './dto/update-member-password.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService extends SharedService<MemberRepository> {
  constructor(readonly repo: MemberRepository) {
    super(repo);
  }

  public async createOne(dto: CreateMemberDto) {
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
    return this.repo.update(id, dto);
  }
}

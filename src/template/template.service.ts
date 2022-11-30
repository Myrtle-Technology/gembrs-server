import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { PaginationOptions } from 'src/shared/shared.repository';
import { SharedService } from 'src/shared/shared.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from './schemas/template.schema';
import { TemplateRepository } from './template.repository';

@Injectable()
export class TemplateService extends SharedService<TemplateRepository> {
  constructor(readonly repo: TemplateRepository) {
    super(repo);
  }
  public async create(
    owner: 'user' | 'organization',
    ownerId: string,
    dto: CreateTemplateDto,
  ) {
    dto[owner] = ownerId;
    return this.repo.create(dto);
  }

  public async findAll(
    owner: 'user' | 'organization',
    ownerId: string,
    params: PaginationOptions<Template>,
  ) {
    params.query = { ...params.query, [owner]: ownerId };
    return this.repo.paginate(params);
  }

  public async findOne(
    owner: 'user' | 'organization',
    ownerId: string,
    id: string,
  ) {
    return this.repo.findOne({ [owner]: ownerId, _id: id });
  }

  public async updateOne(
    owner: 'user' | 'organization',
    ownerId: string,
    id: ObjectId | string,
    dto: UpdateTemplateDto,
  ) {
    dto[owner] = ownerId;
    return this.repo.updateOne({ [owner]: ownerId, _id: id }, dto);
  }

  public async removeOne(
    owner: 'user' | 'organization',
    ownerId: string,
    id: ObjectId | string,
  ) {
    return this.repo.deleteOne({ [owner]: ownerId, _id: id });
  }
}

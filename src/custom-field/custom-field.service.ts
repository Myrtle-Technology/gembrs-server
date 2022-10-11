import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { SharedService } from 'src/shared/shared.service';
import { CustomFieldRepository } from './custom-field.repository';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';

@Injectable()
export class CustomFieldService extends SharedService<CustomFieldRepository> {
  constructor(readonly repo: CustomFieldRepository) {
    super(repo);
  }

  public async createOne(organization: string, dto: CreateCustomFieldDto) {
    dto.organization = organization;
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
    dto: UpdateCustomFieldDto,
  ) {
    dto.organization = organization;
    return this.repo.updateOne({ organization, _id: id }, dto);
  }

  public async removeOne(organization: string, id: ObjectId | string) {
    return this.repo.deleteOne({ organization, _id: id });
  }
}

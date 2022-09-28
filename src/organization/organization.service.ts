import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { SharedService } from 'src/shared/shared.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationRepository } from './organization.repository';

@Injectable()
export class OrganizationService extends SharedService<OrganizationRepository> {
  constructor(readonly repo: OrganizationRepository) {
    super(repo);
  }

  public async createOne(dto: CreateOrganizationDto) {
    return this.repo.create(dto);
  }

  public async findBySiteName(username: string, throwError = true) {
    const user = await this.repo.findBySiteName(username);
    if (!user && throwError) {
      throw new NotFoundException(`Organization not found`);
    }
    return user;
  }

  public async findAll(filter?: any) {
    return this.repo.find();
  }

  public async findById(id: ObjectId | string) {
    return this.repo.findById(id);
  }

  public async update(id: ObjectId | string, dto: UpdateOrganizationDto) {
    return this.repo.update(id, dto);
  }

  public async remove(id: ObjectId | string) {
    return this.repo.delete(id);
  }
}

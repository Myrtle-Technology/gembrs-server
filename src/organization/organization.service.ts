import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { MembershipService } from 'src/membership/membership.service';
import { SharedService } from 'src/shared/shared.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationRepository } from './organization.repository';

@Injectable()
export class OrganizationService extends SharedService<OrganizationRepository> {
  constructor(
    readonly repo: OrganizationRepository,
    private readonly membershipService: MembershipService,
  ) {
    super(repo);
  }

  public async createOne(dto: CreateOrganizationDto) {
    return this.repo.create(dto);
  }

  public async findBySiteName(siteName: string, throwError = true) {
    const organization = await this.repo.findBySiteName(siteName);
    if (!organization && throwError) {
      throw new NotFoundException(`Organization not found`);
    }
    return organization;
  }

  public async findAll(filter?: any) {
    return this.repo.find();
  }

  public async findAllMemberships(organization: string) {
    return this.membershipService.findAll(organization);
  }

  public async findById(id: ObjectId | string) {
    return this.repo.findById(id);
  }

  public async update(id: ObjectId | string, dto: UpdateOrganizationDto) {
    return this.repo.updateById(id, dto);
  }

  public async remove(id: ObjectId | string) {
    return this.repo.deleteById(id);
  }
}

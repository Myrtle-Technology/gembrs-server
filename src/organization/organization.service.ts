import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, ObjectId } from 'mongoose';
import { CustomFieldDefaults } from 'src/custom-field/custom-field.defaults';
import { CustomFieldService } from 'src/custom-field/custom-field.service';
import { CustomField } from 'src/custom-field/schemas/custom-field.schema';
import { MembershipService } from 'src/membership/membership.service';
import { SharedService } from 'src/shared/shared.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationRepository } from './organization.repository';
import { Organization } from './schemas/organization.schema';

@Injectable()
export class OrganizationService extends SharedService<OrganizationRepository> {
  constructor(
    readonly repo: OrganizationRepository,
    private readonly membershipService: MembershipService,
    private readonly customFieldService: CustomFieldService,
  ) {
    super(repo);
  }

  private defaultFields: CustomField[] = [
    CustomFieldDefaults.MembershipId,
    CustomFieldDefaults.FirstName,
    CustomFieldDefaults.LastName,
    CustomFieldDefaults.Email,
    CustomFieldDefaults.PhoneNumber,
    CustomFieldDefaults.Password,
    CustomFieldDefaults.ConfirmPassword,
  ];

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

  public async findAll(limit = 5, filter?: FilterQuery<Organization>) {
    return this.repo.find({ ...filter }, null, { limit });
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

  public async findAllMemberships(organization: string) {
    return this.membershipService.findAll(organization);
  }

  public async getRegistrationFormFields(
    organization: string,
  ): Promise<CustomField[]> {
    const customFields = await this.customFieldService.findAll(organization, {
      active: true,
    });
    return [...this.defaultFields, ...customFields].sort(
      (a, b) => a.order - b.order,
    );
  }
}

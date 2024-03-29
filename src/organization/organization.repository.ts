import { SharedRepository } from 'src/shared/shared.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './schemas/organization.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SaveOptions } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class OrganizationRepository extends SharedRepository<
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto
> {
  constructor(
    @InjectModel(Organization.name) model: Model<Organization>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super(model);
  }

  populateOnFind = ['owner'];

  public async create(dto: CreateOrganizationDto, options?: SaveOptions) {
    dto.siteName = await this.validateOrganizationSiteName(dto);
    const organization = await super.create(dto, options);
    return await this.setOwner(dto.owner, organization._id);
  }

  private async validateOrganizationSiteName(dto: CreateOrganizationDto) {
    const organizationExists = await this.model
      .countDocuments({ siteName: dto.siteName })
      .exec();
    if (organizationExists) {
      return `${dto.siteName}-${organizationExists + 1}`.toLowerCase();
    }
    return dto.siteName;
  }

  public async setOwner(ownerId: string, organizationId: string) {
    await this.userModel.findOneAndUpdate(
      { _id: ownerId },
      { $addToSet: { organizations: organizationId } },
    );
    return this.findById(organizationId);
  }

  public async findOrCreate(dto: CreateOrganizationDto) {
    dto.siteName = await this.validateOrganizationSiteName(dto);
    const organization = await this.model.findOneAndUpdate(
      { siteName: dto.siteName },
      dto,
      {
        upsert: true,
        new: true,
      },
    );
    if (!organization) {
      return { organization: await this.create(dto), created: true };
    }

    return {
      organization: await this.setOwner(dto.owner, organization._id),
      created: false,
    };
  }

  public async findBySiteName(siteName: string) {
    return this.model.findOne({ siteName }, null, {
      lean: true,
      populate: [
        { path: 'owner', select: 'firstName lastName -_id' },
        { path: 'membersCount' },
      ],
    });
  }
}

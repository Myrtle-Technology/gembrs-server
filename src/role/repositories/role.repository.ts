import { SharedRepository } from 'src/shared/shared.repository';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Role } from '../schemas/role.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class RoleRepository extends SharedRepository<
  Role,
  CreateRoleDto,
  UpdateRoleDto
> {
  constructor(@InjectModel(Role.name) model: Model<Role>) {
    super(model);
  }

  public async findOrCreate(dto: CreateRoleDto) {
    const role = await this.model.findOneAndUpdate({ slug: dto.slug }, dto, {
      upsert: true,
      new: true,
    });
    if (!role) {
      return { role: await this.create(dto), created: true };
    }
    return { role, created: false };
  }

  public async findBySlug(organization: string, slug: string) {
    return this.model
      .findOne({ organization, slug })
      .populate(this.populateOnFind)
      .exec();
  }
  public async findDefaultRoles() {
    return this.model.find({ slug: { $in: Object.values(RoleEnum) } });
  }

  public async getDefaultAdminRole() {
    return this.findOne({ slug: RoleEnum.Admin });
  }

  public async getDefaultMemberRole() {
    return this.findOne({ slug: RoleEnum.Member });
  }
}

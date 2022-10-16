import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import slugify from 'slugify';
import { SharedService } from 'src/shared/shared.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleEnum } from '../enums/role.enum';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RoleService
  extends SharedService<RoleRepository>
  implements OnModuleInit
{
  constructor(readonly repo: RoleRepository) {
    super(repo);
  }

  async onModuleInit() {
    await Promise.all([
      ...Object.keys(RoleEnum).map(async (key) => {
        const slug = slugify(key, { lower: true });
        await this.findOrCreate({
          name: key,
          slug,
        });
      }),
    ]);
  }

  public async getDefaultAdminRole() {
    return this.repo.getDefaultAdminRole();
  }

  public async getDefaultMemberRole() {
    return this.repo.getDefaultMemberRole();
  }

  public async findDefaultRoles() {
    return this.repo.findDefaultRoles();
  }

  public async findOrCreate(dto: CreateRoleDto) {
    dto.slug = (dto.slug ?? slugify(dto.name)).toLowerCase();
    return this.repo.findOrCreate(dto);
  }

  public async findBySlug(
    organization: string,
    slug: string,
    throwError = true,
  ) {
    const role = await this.repo.findBySlug(organization, slug);
    if (!role && throwError) {
      throw new NotFoundException(`Role not found`);
    }
    return role;
  }

  public async findAll(organization: string, filter?: any) {
    return this.repo.find({
      ...filter,
      organization: { $in: [null, organization] },
    });
  }

  public async findOne(organization: string, id: ObjectId | string) {
    return this.repo.findOne({
      _id: id,
      organization: { $in: [null, organization] },
    });
  }

  public async updateOne(
    organization: string,
    id: ObjectId | string,
    dto: UpdateRoleDto,
  ) {
    return this.repo.updateOne({ _id: id, organization }, dto);
  }

  public async removeOne(organization: string, id: ObjectId | string) {
    return this.repo.deleteOne({ _id: id, organization });
  }
}

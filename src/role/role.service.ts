import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import slugify from 'slugify';
import { SharedService } from 'src/shared/shared.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEnum } from './enums/role.enum';
import { RoleRepository } from './role.repository';

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
    return this.repo.findOne({ slug: 'admin' });
  }

  public async getDefaultMemberRole() {
    return this.repo.findOne({ slug: 'member' });
  }

  public async findOrCreate(dto: CreateRoleDto) {
    dto.slug = (dto.slug ?? slugify(dto.name)).toLowerCase();
    return this.repo.findOrCreate(dto);
  }

  public async findBySlug(slug: string, throwError = true) {
    const role = await this.repo.findBySlug(slug);
    if (!role && throwError) {
      throw new NotFoundException(`Role not found`);
    }
    return role;
  }

  public async findAll(filter?: any) {
    return this.repo.find();
  }

  public async findById(id: ObjectId | string) {
    return this.repo.findById(id);
  }

  public async update(id: ObjectId | string, dto: UpdateRoleDto) {
    return this.repo.updateById(id, dto);
  }

  public async remove(id: ObjectId | string) {
    return this.repo.deleteById(id);
  }
}

import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import slugify from 'slugify';
import { SharedService } from 'src/shared/shared.service';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { UpdateResourceDto } from '../dto/update-resource.dto';
import { ResourcesEnum } from '../enums/resources.enum';
import { ResourceRepository } from '../repositories/resource.repository';

@Injectable()
export class ResourceService
  extends SharedService<ResourceRepository>
  implements OnModuleInit
{
  constructor(readonly repo: ResourceRepository) {
    super(repo);
  }

  async onModuleInit() {
    await Promise.all([
      ...Object.keys(ResourcesEnum).map(async (key) => {
        const slug = slugify(key, { lower: true });
        await this.findOrCreate({
          name: key,
          slug,
        });
      }),
    ]);
  }

  public async findOrCreate(dto: CreateResourceDto) {
    dto.slug = (dto.slug ?? slugify(dto.name)).toLowerCase();
    return this.repo.findOrCreate(dto);
  }

  public async findBySlug(slug: string, throwError = true) {
    const resource = await this.repo.findBySlug(slug);
    if (!resource && throwError) {
      throw new NotFoundException(`Resource not found`);
    }
    return resource;
  }

  public async findAll(filter?: any) {
    return this.repo.find();
  }

  public async findById(id: ObjectId | string) {
    return this.repo.findById(id);
  }

  public async update(id: ObjectId | string, dto: UpdateResourceDto) {
    return this.repo.updateById(id, dto);
  }

  public async remove(id: ObjectId | string) {
    return this.repo.deleteById(id);
  }
}

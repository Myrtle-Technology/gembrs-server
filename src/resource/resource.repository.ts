import { SharedRepository } from 'src/shared/shared.repository';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './schemas/resource.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ResourceRepository extends SharedRepository<
  Resource,
  CreateResourceDto,
  UpdateResourceDto
> {
  constructor(@InjectModel(Resource.name) model: Model<Resource>) {
    super(model);
  }

  public async findOrCreate(dto: CreateResourceDto) {
    const resource = await this.model.findOneAndUpdate(
      { slug: dto.slug },
      dto,
      {
        upsert: true,
        new: true,
      },
    );
    if (!resource) {
      return { resource: await this.create(dto), created: true };
    }
    return { resource, created: false };
  }

  findBySlug(slug: string) {
    return this.model.findOne({ slug: slug }).exec();
  }
}

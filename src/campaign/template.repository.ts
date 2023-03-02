import { SharedRepository } from 'src/shared/shared.repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from './schemas/template.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

@Injectable()
export class TemplateRepository extends SharedRepository<
  Template,
  CreateTemplateDto,
  UpdateTemplateDto
> {
  constructor(@InjectModel(Template.name) model: Model<Template>) {
    super(model);
  }

  protected populateOnFind = ['user', 'organization'];

  public async find(
    filter: FilterQuery<Template>,
    projection?: ProjectionType<Template>,
    options?: QueryOptions<Template>,
  ) {
    return this.model
      .find(filter, projection, options)
      .populate(this.populateOnFind)
      .exec();
  }
}

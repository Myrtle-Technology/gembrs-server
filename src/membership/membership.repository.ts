import { SharedRepository } from 'src/shared/shared.repository';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './schemas/membership.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SaveOptions } from 'mongoose';

@Injectable()
export class MembershipRepository extends SharedRepository<
  Membership,
  CreateMembershipDto,
  UpdateMembershipDto
> {
  constructor(@InjectModel(Membership.name) model: Model<Membership>) {
    super(model);
  }

  protected populateOnFind = ['changeableTo', 'questions'];

  public async create(dto: CreateMembershipDto, options?: SaveOptions) {
    const userExists = await this.model.exists({
      name: dto.name,
      organization: dto.organization,
    });
    if (userExists) {
      throw new BadRequestException(
        `You already have a membership with the name ${dto.name}, please choose another name.`,
      );
    }
    if (dto.questions) {
      dto.questions = dto.questions.map((q) => {
        q.organization = dto.organization;
        return q;
      });
    }
    return super.create(dto, options);
  }
}

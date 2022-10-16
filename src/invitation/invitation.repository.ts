import { SharedRepository } from 'src/shared/shared.repository';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { Invitation } from './schemas/invitation.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class InvitationRepository extends SharedRepository<
  Invitation,
  CreateInvitationDto,
  UpdateInvitationDto
> {
  constructor(@InjectModel(Invitation.name) model: Model<Invitation>) {
    super(model);
  }

  protected populateOnFind = ['role', 'organization', 'user', 'membership'];
}

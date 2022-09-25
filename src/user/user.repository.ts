import { SharedRepository } from 'src/shared/shared.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends SharedRepository<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(@InjectModel(User.name) model: Model<User>) {
    super(model);
  }
}

import { SharedRepository } from 'src/shared/shared.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isEmail } from 'class-validator';

@Injectable()
export class UserRepository extends SharedRepository<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(@InjectModel(User.name) model: Model<User>) {
    super(model);
  }

  public async findOrCreate(dto: CreateUserDto): Promise<[User, boolean]> {
    const query =
      dto.email && dto.phone
        ? { $or: [{ email: dto.email }, { phone: dto.phone }] }
        : dto.email
        ? { email: dto.email }
        : { phone: dto.phone };
    const user = await this.model.findOneAndUpdate(query, dto, {
      upsert: true,
      new: true,
    });
    if (!user) {
      const _user = await this.model.create(dto);
      return [await this.findById(_user.id), true];
    }
    return [user, false];
  }

  findByUsername(username: string) {
    return this.model.findOne(
      isEmail(username) ? { email: username } : { phone: username },
    );
  }
}

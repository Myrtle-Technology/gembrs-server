import { Injectable, BadRequestException } from '@nestjs/common';
import { SharedService } from 'src/shared/shared.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { isEmail, isPhoneNumber } from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService extends SharedService<UserRepository> {
  constructor(readonly repo: UserRepository) {
    super(repo);
  }

  public async createOne(dto: CreateUserDto) {
    if (!(dto.email || dto.phone)) {
      throw new BadRequestException(
        'You need to enter either your email or phone number',
      );
    }
    return this.repo.create(dto);
  }

  public async getUserByUsername(username: string, throwError = true) {
    let user: User & { _id: Types.ObjectId };
    if (isPhoneNumber(username)) {
      user = await this.repo.findOne({ phone: username });
    }
    if (isEmail(username)) {
      user = await this.repo.findOne({ email: username });
    }
    if (!user && throwError) {
      throw new BadRequestException(`Username is invalid`);
    }
    return user;
  }

  public async findAll(filter?: any) {
    return this.repo.find();
  }

  public async findOne(id: ObjectId | string) {
    return this.findOne(id);
  }

  public async update(id: ObjectId | string, dto: UpdateUserDto) {
    delete dto.verified; // verification can only happen via auth verifyOTP route
    return this.repo.update(id, dto);
  }

  public async remove(id: ObjectId | string) {
    return this.repo.delete(id);
  }
}

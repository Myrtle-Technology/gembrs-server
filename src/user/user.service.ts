import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SharedService } from 'src/shared/shared.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { ObjectId } from 'mongoose';

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
    return this.repo.findOrCreateByUsername(dto);
  }

  public async getUserByUsername(username: string, throwError = true) {
    const user = await this.repo.findUserByUsername(username);
    if (!user && throwError) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  public async findAll(filter?: any) {
    return this.repo.find();
  }

  public async findById(id: ObjectId | string) {
    return this.repo.findById(id);
  }

  public async update(id: ObjectId | string, dto: UpdateUserDto) {
    delete dto.verified; // verification can only happen via auth verifyOTP route
    return this.repo.update(id, dto);
  }

  public async remove(id: ObjectId | string) {
    return this.repo.delete(id);
  }
}

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
import { PaginationOptions } from 'src/shared/shared.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService extends SharedService<UserRepository> {
  constructor(readonly repo: UserRepository) {
    super(repo);
  }

  public async findUpdateOrCreate(dto: CreateUserDto) {
    if (!(dto.email || dto.phone)) {
      throw new BadRequestException(
        'You need to enter either your email or phone number',
      );
    }
    return this.repo.findOneOrCreate(dto);
  }

  public async findUpdateOrCreateBulk(dto: string[]) {
    return this.repo.findOrCreateBulk(dto);
  }

  public async findByUsername(username: string, throwError = true) {
    const user = await this.repo.findByUsername(username);
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
    delete dto.verifiedEmail; // verification can only happen via auth verifyOTP route
    delete dto.verifiedPhone; // verification can only happen via auth verifyOTP route
    return this.repo.updateById(id, dto);
  }

  public async remove(id: ObjectId | string) {
    return this.repo.deleteById(id);
  }

  public async findUserOrganizations(user: string) {
    return this.repo.findUserOrganizations(user);
  }

  public async findUserContacts(user: string, search?: string) {
    return this.repo.findUserContacts(user, search);
  }
}

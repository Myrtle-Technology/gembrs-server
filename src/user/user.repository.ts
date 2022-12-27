import { SharedRepository } from 'src/shared/shared.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isEmail } from 'class-validator';
import { Member } from 'src/member/schemas/member.schema';
import { Organization } from 'src/organization/schemas/organization.schema';

@Injectable()
export class UserRepository extends SharedRepository<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectModel(User.name) model: Model<User>,
    @InjectModel(Member.name) readonly memberModel: Model<Member>,
  ) {
    super(model);
  }

  public async findUserOrganizations(user: string): Promise<Organization[]> {
    const members = await this.memberModel
      .find({ user })
      .populate('organization')
      .exec();
    return members.map((m) => m.organization);
  }

  public async findOneAndUpdateOrCreate(
    dto: CreateUserDto,
  ): Promise<[User, boolean]> {
    const query =
      dto.email && dto.phone
        ? { $or: [{ email: dto.email }, { phone: dto.phone }] }
        : dto.email
        ? { email: dto.email }
        : { phone: dto.phone };
    const user = await this.model.findOneAndUpdate(query, dto, {
      new: true,
    });
    if (!user) {
      const _user = await this.model.create(dto);
      return [await this.findById(_user.id), true];
    }
    return [user, false];
  }

  public async findByUsername(username: string) {
    return this.model.findOne(
      isEmail(username) ? { email: username } : { phone: username },
    );
  }

  public async findUpdateOrCreateBulk(dto: string[]) {
    const users = await this.model.find({
      $or: dto.map((d) => (isEmail(d) ? { email: d } : { phone: d })),
    });
    const usersFound = users.map((u) => u.email || u.phone);
    const usersToCreate = dto.filter((d) => !usersFound.includes(d));
    const createdUsers = await this.model.insertMany(
      usersToCreate.map((u) => ({
        email: isEmail(u) ? u : undefined,
        phone: isEmail(u) ? undefined : u,
      })),
    );
    return [...users, ...createdUsers];
  }
}

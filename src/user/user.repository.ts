import { SharedRepository } from 'src/shared/shared.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, QueryOptions } from 'mongoose';
import { isEmail } from 'class-validator';
import { Member } from 'src/member/schemas/member.schema';
import { Organization } from 'src/organization/schemas/organization.schema';
import { groupBy, map } from 'lodash';
import { UserContact } from './interfaces/user-contact.interface';

@Injectable()
export class UserRepository extends SharedRepository<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectModel(User.name) model: Model<User>,
    @InjectModel(Member.name) readonly memberModel: Model<Member>,
    @InjectModel(Organization.name)
    readonly organizationModel: Model<Organization>,
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

  public async findOneOrCreate(dto: CreateUserDto): Promise<[User, boolean]> {
    const query =
      dto.email && dto.phone
        ? { $or: [{ email: dto.email }, { phone: dto.phone }] }
        : dto.email
        ? { email: dto.email }
        : { phone: dto.phone };
    const user = await this.model.findOne(query);
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

  public async findOrCreateBulk(dto: string[]) {
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

  public async updateById(
    id: ObjectId | any,
    dto: UpdateUserDto,
    options?: QueryOptions<User>,
  ): Promise<User> {
    const user = await this.model.findByIdAndUpdate(id, dto, {
      new: true,
      ...options,
      populate: this.populateOnFind,
    });
    this.memberModel.find({ user: user.id }).updateMany({
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      userPhone: user.phone,
    });
    return user;
  }

  public async findUserOwnedOrganizations(
    user: string,
  ): Promise<Organization[]> {
    return this.organizationModel.find({ owner: user }).exec();
  }

  public async findUserContacts(
    user: string,
    search?: string,
  ): Promise<UserContact[]> {
    // get all organizations of user
    const organizations = await this.organizationModel
      .find({
        owner: user,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      })
      .exec();
    // get all users of those organizations
    const members = await this.memberModel
      .find({
        organization: { $in: organizations.map((o) => o.id) },
        $or: [
          { userName: { $regex: search, $options: 'i' } },
          { userEmail: { $regex: search, $options: 'i' } },
          { userPhone: { $regex: search, $options: 'i' } },
        ],
      })
      .populate(['user', 'organization'])
      .exec();
    return map(
      groupBy(members, (m) => m.organization._id),
      function (items) {
        return {
          organization: items[0].organization,
          contacts: map(items, 'user'),
        };
      },
    );
  }
}

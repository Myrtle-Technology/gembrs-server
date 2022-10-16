import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MemberRepository } from './member.repository';
import { Member, MemberSchema } from './schemas/member.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MemberCustomField,
  MemberCustomFieldSchema,
} from './schemas/member-custom-field.schema';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { MembershipModule } from 'src/membership/membership.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    MembershipModule,
    SubscriptionModule,
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: MemberCustomField.name, schema: MemberCustomFieldSchema },
    ]),
  ],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberService, MemberRepository],
})
export class MemberModule {}

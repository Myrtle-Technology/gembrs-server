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

@Module({
  imports: [
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

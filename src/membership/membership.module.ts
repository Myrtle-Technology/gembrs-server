import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MembershipRepository } from './membership.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipSchema } from './schemas/membership.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Membership', schema: MembershipSchema },
    ]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService, MembershipRepository],
  exports: [MembershipService, MembershipRepository],
})
export class MembershipModule {}

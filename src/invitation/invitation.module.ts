import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { InvitationRepository } from './invitation.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from './schemas/invitation.schema';
import { MailModule } from 'src/mail/mail.module';
import { SmsModule } from 'src/sms/sms.module';
import { MemberModule } from 'src/member/member.module';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    MemberModule,
    MailModule,
    SmsModule,
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
    ]),
  ],
  controllers: [InvitationController],
  providers: [InvitationService, InvitationRepository],
  exports: [InvitationService, InvitationRepository],
})
export class InvitationModule {}

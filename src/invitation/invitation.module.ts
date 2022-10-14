import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { InvitationRepository } from './invitation.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from './schemas/invitation.schema';
import { MailModule } from 'src/mail/mail.module';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [
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

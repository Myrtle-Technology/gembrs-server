import { RecipientRepository } from './recipient.repository';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { TemplateRepository } from './template.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './schemas/template.schema';
import { Recipient, RecipientSchema } from './schemas/recipient.schema';
import { CampaignRepository } from './campaign.repository';
import { MailModule } from 'src/mail/mail.module';
import { SmsModule } from 'src/sms/sms.module';
import { MemberSchema, Member } from 'src/member/schemas/member.schema';
import { UserSchema, User } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: CampaignSchema, name: Campaign.name },
    ]),
    MongooseModule.forFeature([
      { schema: TemplateSchema, name: Template.name },
    ]),
    MongooseModule.forFeature([
      { schema: RecipientSchema, name: Recipient.name },
    ]),
    MongooseModule.forFeature([{ schema: MemberSchema, name: Member.name }]),
    MongooseModule.forFeature([{ schema: UserSchema, name: User.name }]),
    MailModule,
    SmsModule,
  ],
  controllers: [CampaignController],
  providers: [
    CampaignService,
    TemplateRepository,
    CampaignRepository,
    RecipientRepository,
  ],
})
export class CampaignModule {}

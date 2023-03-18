import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { ElasticMailService } from './elastic-mail.service';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [forwardRef(() => MemberModule)],
  providers: [MailService, ElasticMailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}

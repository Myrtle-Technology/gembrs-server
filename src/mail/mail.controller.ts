import { Controller, Post, Body, Req } from '@nestjs/common';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { SendMailDto } from './dto/send-mail.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly service: MailService) {}

  @Post('/send')
  sendEmail(@Req() request: TokenRequest, @Body() dto: SendMailDto) {
    // this.service.sendMail(
    //   'organization',
    //   request.tokenData.organizationId,
    //   dto,
    // );
    return 'send not implemented';
  }
}

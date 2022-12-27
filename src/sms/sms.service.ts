import { BadRequestException, Injectable } from '@nestjs/common';
import { isPhoneNumber } from 'class-validator';
import { APP_NAME } from 'src/app.constants';
import { TermiiService } from './termii.service';

@Injectable()
export class SmsService {
  constructor(private termii: TermiiService) {}

  sendWelcomeSMS(phone: string) {
    if (!isPhoneNumber(phone)) {
      throw Error('Invalid phone number');
    }
    return this.termii.sendSms(
      phone.replace('+', ''),
      `Welcome to ${APP_NAME}`,
    );
  }

  sanitizePhoneNumber(phone: string) {
    if (!isPhoneNumber(phone)) {
      throw Error('Invalid phone number');
    }
    return phone.replace('+', '');
  }

  sendMemberInvitationSMS(dto: {
    phone: string;
    hostName: string;
    organizationName: string;
    message: string;
    link: string;
  }) {
    this.termii.sendSms(
      this.sanitizePhoneNumber(dto.phone),
      `${dto.hostName} has invited you to join ${dto.organizationName} on ${APP_NAME}. ${dto.message}. Click ${dto.link} to join the community`,
    );
  }

  sendOTPLocal(phone: string, otp: string) {
    return this.termii.sendSms(
      this.sanitizePhoneNumber(phone),
      `Your otp is ${otp} from ${APP_NAME}`,
    );
  }

  async verifyOTP(pinId: string, otp: string) {
    const response = await this.termii.verifyOtp(pinId, otp);
    if (response && response.status == 200 && response.data.verified == true) {
      return true;
    }
    throw new BadRequestException(
      `The one time password (OTP) you entered is invalid`,
    );
  }

  sendOTP(phone: string) {
    return this.termii.sendOtp(this.sanitizePhoneNumber(phone));
  }
}

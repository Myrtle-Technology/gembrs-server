import { BadRequestException, Injectable } from '@nestjs/common';
import { isPhoneNumber } from 'class-validator';
import { APP_NAME } from 'src/app.constants';
import { Invitation } from 'src/invitation/schemas/invitation.schema';
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

  sendMemberInviteSMS(invitation: Invitation, link: string) {
    const phone = this.sanitizePhoneNumber(invitation.user.phone);
    return this.termii.sendSms(
      phone,
      `You have been invited to join ${invitation.organization.name} on ${APP_NAME}. Kindly click on the link below to join. ${link}`,
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

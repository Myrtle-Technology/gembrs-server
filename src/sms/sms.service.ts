import { Injectable } from '@nestjs/common';
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
      APP_NAME,
    );
  }

  sendMemberInviteSMS(invitation: Invitation, link: string) {
    if (!isPhoneNumber(invitation.user.phone)) {
      throw Error('Invalid phone number');
    }
    return this.termii.sendSms(
      invitation.user.phone.replace('+', ''),
      `You have been invited to join ${invitation.organization.name} on ${APP_NAME}. Kindly click on the link below to join. ${link}`,
      APP_NAME,
    );
  }

  sendOTPLocal(phone: string, otp: string) {
    if (!isPhoneNumber(phone)) {
      throw Error('Invalid phone number');
    }
    return this.termii.sendSms(
      phone.replace('+', ''),
      `Your otp is ${otp} from ${APP_NAME}`,
    );
  }

  verifyOTP(phone: string, otp: string) {
    if (!isPhoneNumber(phone)) {
      throw Error('Invalid phone number');
    }
    return this.termii.verifyOtp(phone.replace('+', ''), otp);
  }

  sendOTP(phone: string) {
    if (!isPhoneNumber(phone)) {
      throw Error('Invalid phone number');
    }
    return this.termii.sendOtp(phone.replace('+', ''), 'Gembrs', 'dnd');
  }
}

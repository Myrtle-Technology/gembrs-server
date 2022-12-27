import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  TermiiBulkRequestParams,
  TermiiRequestParams,
} from './dto/termii-request-params.dto';
import { TermiiSendSmsResponse } from './interfaces/termii-send-sms-response.interface';

@Injectable()
export class TermiiService {
  private readonly TERMII_URL = 'https://termii.com/api';
  private readonly TERMII_SENDER_ID = 'Gembrs';
  private readonly apiKey = this.configService.get<string>('TERMII_API_KEY');
  private axios = axios.create({
    baseURL: this.TERMII_URL,
    headers: {
      'Content-Type': 'Application/json',
      Accept: 'Application/json',
    },
  });
  private data: Partial<TermiiRequestParams> = {
    type: 'plain',
    api_key: this.apiKey,
  };

  constructor(private configService: ConfigService) {}

  private checkIfApiKeyIsSet() {
    if (!this.apiKey) {
      throw new Error(
        'TERMII API KEY is not set. Visit https://termii.com/account/api to get your api key',
      );
    }
  }

  async sendSms(
    to: string,
    message: string,
    channel: 'generic' | 'whatsapp' | 'dnd' = 'generic',
  ) {
    this.checkIfApiKeyIsSet();

    try {
      const response = await this.axios.post<TermiiSendSmsResponse>(
        '/sms/send',
        new TermiiRequestParams({
          to,
          sms: message,
          from: this.TERMII_SENDER_ID,
          ...this.data,
          channel,
        }).toString(),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return;
    }
  }
  /*async sendBulkSms(
    to: string[],
    message: string,
    channel: 'generic' | 'whatsapp' | 'dnd' = 'generic',
  ) {
    this.checkIfApiKeyIsSet();

    try {
      const response = await this.axios.post<TermiiSendSmsResponse>(
        '/sms/send/bulk',
        new TermiiBulkRequestParams({
          to,
          sms: message,
          from: this.TERMII_SENDER_ID,
          ...this.data,
          channel,
        }).toString(),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return;
    }
  }*/

  async sendSMSFromRandomNumber(to: string, message: string) {
    this.checkIfApiKeyIsSet();

    const response = await this.axios.post<TermiiSendSmsResponse>(
      '/sms/number/send',
      new TermiiRequestParams({
        to,
        sms: message,
        ...this.data,
      }).toString(),
    );
    return response.data;
  }

  async sendOtp(
    to: string,
    channel: 'generic' | 'whatsapp' | 'dnd' = 'generic',
  ) {
    this.checkIfApiKeyIsSet();

    try {
      const response = await this.axios.post(
        '/sms/otp/send',
        new TermiiRequestParams({
          api_key: this.apiKey,
          message_type: 'NUMERIC',
          to: to,
          from: this.TERMII_SENDER_ID,
          channel: channel,
          pin_attempts: 10,
          pin_time_to_live: 15,
          pin_length: 6,
          pin_placeholder: '< 1234 >',
          message_text: `Your ${this.TERMII_SENDER_ID} App pin is < 1234 >. Please enter this pin to continue. This pin will expire in 15 minutes`,
          pin_type: 'NUMERIC',
        }),
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Sorry we are unable to send you a verification token at this time, please try again later',
      );
    }
  }

  async verifyOtp(pin_id: string, pin: string) {
    this.checkIfApiKeyIsSet();
    try {
      return await this.axios.post(
        '/sms/otp/verify',
        new TermiiRequestParams({
          api_key: this.apiKey,
          pin_id,
          pin,
        }).toString(),
      );
    } catch (error) {
      console.log(error.status, error.response?.data);
      throw new InternalServerErrorException(
        error,
        'Sorry we are unable to verify your OTP at this time, please try again later',
      );
    }
  }
}

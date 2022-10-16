import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_NAME } from 'src/app.constants';
import { Invitation } from 'src/invitation/schemas/invitation.schema';
import { Member } from 'src/member/schemas/member.schema';
import { Organization } from 'src/organization/schemas/organization.schema';
import { User } from './../user/schemas/user.schema';
import { ElasticMailService } from './elastic-mail.service';
import { ElasticMailTemplateNames } from './elastic-mail.templates';

@Injectable()
export class MailService {
  private readonly clientURL = this.configService.get('CLIENT_URL');
  constructor(
    private mailerService: ElasticMailService,
    private configService: ConfigService,
  ) {}

  async welcomeRegisteredOrganization(user: User, organization: Organization) {
    const memberUrl = `https://${organization.siteName}.${this.clientURL
      .replace('https://', '')
      .replace('http://', '')}`;
    const adminUrl = `${memberUrl}/admin`;

    await this.mailerService.send({
      Recipients: { To: [user.email] },
      Content: {
        Subject: `Welcome to ${APP_NAME}! Make yourself at home`,
        TemplateName: ElasticMailTemplateNames.WelcomeToGembrs,
        Merge: {
          name: `${user.firstName}`,
          memberUrl,
          adminUrl,
          APP_NAME,
          organization: `${organization.name}`,
        },
      },
    });
  }

  async sendVerificationCode(email: string, code: number | string) {
    return await this.mailerService.send({
      Recipients: { To: [email] },
      Content: {
        Subject: `${APP_NAME} – email verification`,
        TemplateName: ElasticMailTemplateNames.VerifyYourEmail,
        Merge: {
          name: `${email}`,
          code: `${code}`,
          APP_NAME,
        },
      },
    });
  }

  async resetPasswordRequest(user: User, link: string) {
    return await this.mailerService.send({
      Recipients: { To: [user.email] },
      Content: {
        Subject: 'You requested for a Password reset!',
        TemplateName: './request-password-reset.template.hbs', // `.hbs` extension is appended automatically
        Merge: {
          name: `${user.firstName}`,
          link,
        },
      },
    });
  }

  async resetPassword(user: User) {
    const link = this.clientURL;
    return await this.mailerService.send({
      Recipients: { To: [user.email] },
      Content: {
        Subject: 'Password Reset Successfully!',
        TemplateName: './password-reset.template.hbs', // `.hbs` extension is appended automatically
        Merge: {
          name: `${user.firstName}`,
          link,
          APP_NAME,
        },
      },
    });
  }

  async confirmUserEmail(user: User, token: string) {
    const url = `${this.clientURL}?token=${token}`;

    await this.mailerService.send({
      Recipients: { To: [user.email] },
      Content: {
        // from: '"Support Team" <support@example.com>', // override default from
        Subject: 'Welcome to Nice App! Confirm your Email',
        TemplateName: './confirm-email.template.hbs', // `.hbs` extension is appended automatically
        Merge: {
          name: `${user.firstName}`,
          url,
          APP_NAME,
        },
      },
    });
  }

  public async sendMemberInviteEmail(invitation: Invitation, link: string) {
    await this.mailerService.send({
      Recipients: { To: [invitation.user.email] },
      Content: {
        Subject: `You have been invited to join ${invitation.organization.name}`,
        TemplateName: ElasticMailTemplateNames.MemberInvite, // `.hbs` extension is appended automatically
        Merge: {
          name: `${invitation.user.firstName || invitation.user.email}`,
          link,
          APP_NAME,
        },
      },
    });
  }

  async welcomeNewUser(member: Member) {
    // TODO: Get template set by organization and send email
    const organizationUrl = `https://${
      member.organization.siteName
    }.${this.clientURL.replace('https://', '').replace('http://', '')}`;
    const profileUrl = `${organizationUrl}/profile`;

    await this.mailerService.send({
      Recipients: { To: [member.user.email] },
      Content: {
        Subject: `Welcome to ${APP_NAME}! Make yourself at home`,
        TemplateName: ElasticMailTemplateNames.WelcomeToGembrs,
        Merge: {
          name: `${member.user.firstName}`,
          organizationUrl,
          profileUrl,
          APP_NAME,
          organization: `${member.organization.name}`,
        },
      },
    });
  }
}

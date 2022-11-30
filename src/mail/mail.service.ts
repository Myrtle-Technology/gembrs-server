import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_NAME } from 'src/app.constants';
import { Invitation } from 'src/invitation/schemas/invitation.schema';
import { Member } from 'src/member/schemas/member.schema';
import { Organization } from 'src/organization/schemas/organization.schema';
import { User } from './../user/schemas/user.schema';
import { ElasticMailService } from './elastic-mail.service';
import { ElasticMailTemplateNames } from './elastic-mail.templates';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { SendMailDto } from './dto/send-mail.dto';
import { TemplateService } from 'src/template/template.service';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class MailService {
  private readonly clientURL = this.configService.get('CLIENT_URL');
  constructor(
    private mailerService: MailerService,
    private elasticMailService: ElasticMailService,
    private configService: ConfigService,
    private templateService: TemplateService,
    @Inject(forwardRef(() => MemberService))
    private memberService: MemberService,
  ) {}

  async send({ html, context, ...options }: ISendMailOptions) {
    const template = Handlebars.compile(html);
    return this.mailerService.sendMail({ ...options, html: template(context) });
  }

  // Move to newsletters later -- not tested
  async sendMail(
    owner: 'user' | 'organization',
    ownerId: string,
    dto: SendMailDto,
  ) {
    const template = await this.templateService.findOne(
      owner,
      ownerId,
      dto.template,
    );
    if (owner == 'organization') {
      const contacts = await this.memberService.findAll(ownerId, {
        _id: { $in: dto.contacts },
      });
      // send emails in chunks of 50

      const emailsToBeSent: ISendMailOptions[] = contacts
        .filter((c) => !!c.user.email) // work with users that have emails
        .map((contact) => ({
          html: template.html,
          context: { ...contact.user },
          to: {
            address: contact.user.email,
            name: `${contact.user.firstName} ${contact.user.lastName}`,
          },
        }));

      this.processEmailSending(emailsToBeSent);
    }
  }

  chunkEmails<T = unknown>(arr: T[], chunkSize: number): T[][] {
    return Array.from(Array(Math.ceil(arr.length / chunkSize)), (_, i) =>
      arr.slice(i * chunkSize, i * chunkSize + chunkSize),
    );
  }

  // run this and figure out a way to give delivery reports
  // see if you can schedule it after every 30 mins
  async processEmailSending(options: ISendMailOptions[]) {
    const chunks = this.chunkEmails(options, 50);
    chunks.forEach((chunk) => {
      const mailSendingProcesses: Promise<void>[] = chunk.map((option) =>
        this.send(option),
      );
      Promise.all(mailSendingProcesses)
        .then((data) => {
          console.log('Email sent:', data);
        })
        .catch((reason) => {
          console.error('Some email failed to send', reason);
        });
    });
  }

  async welcomeRegisteredOrganization(user: User, organization: Organization) {
    const memberUrl = `https://${organization.siteName}.${this.clientURL
      .replace('https://', '')
      .replace('http://', '')}`;
    const adminUrl = `${memberUrl}/admin`;

    await this.elasticMailService.send({
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
    return await this.elasticMailService.send({
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
    return await this.elasticMailService.send({
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
    return await this.elasticMailService.send({
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

    await this.elasticMailService.send({
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
    await this.elasticMailService.send({
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

    await this.elasticMailService.send({
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

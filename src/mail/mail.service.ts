import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_NAME } from 'src/app.constants';
import { Member } from 'src/member/schemas/member.schema';
import { Organization } from 'src/organization/schemas/organization.schema';
import { User } from './../user/schemas/user.schema';
import { ElasticMailService } from './elastic-mail.service';
import { ElasticMailTemplateNames } from './elastic-mail.templates';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { SendMailDto } from './dto/send-mail.dto';
import { MemberService } from 'src/member/member.service';
import { ArrayHelper } from 'src/shared/helpers/array.helper';
import { compile } from 'handlebars';

@Injectable()
export class MailService {
  private readonly clientURL = this.configService.get('FRONTEND_BASE_URL');
  constructor(
    private mailerService: MailerService,
    private elasticMailService: ElasticMailService,
    private configService: ConfigService,
    @Inject(forwardRef(() => MemberService))
    private memberService: MemberService,
  ) {}

  async send({ html, context, ...options }: ISendMailOptions) {
    const template = Handlebars.compile(html);
    return this.mailerService.sendMail({ ...options, html: template(context) });
  }

  public async sendMail(dto: SendMailDto) {
    const template = compile(dto.template);
    const emailsToBeSent: ISendMailOptions[] = dto.recipients
      .filter((recipient) => !!recipient.email) // work with users that have emails
      .map((recipient) => ({
        html: template(recipient.user),
        context: { ...recipient },
        to: {
          address: recipient.email,
          name: `${recipient.user.firstName} ${recipient.user.lastName}`,
        },
      }));

    this.processEmailSending(emailsToBeSent);
  }

  // run this and figure out a way to give delivery reports
  // see if you can schedule it after every 30 mins
  private async processEmailSending(options: ISendMailOptions[]) {
    const chunks = ArrayHelper.chunk(options, 50);
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

  async welcomeRegisteredUserAndOrganization(
    user: User,
    organization: Organization,
  ) {
    const memberUrl = `${this.clientURL}/${organization.siteName}`;
    const adminUrl = `${this.clientURL}/community/${organization.siteName}`;

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
  async welcomeRegisteredMember(user: User, organization: Organization) {
    const memberUrl = `${this.clientURL}/${organization.siteName}`;
    const adminUrl = `${this.clientURL}/community/${organization.siteName}`;

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

  public async sendMemberInvitationEmail(dto: {
    name: string;
    email: string;
    hostName: string;
    organizationName: string;
    message: string;
    link: string;
  }) {
    return this.elasticMailService.send({
      Recipients: { To: [dto.email] },
      Content: {
        Subject: `${dto.hostName} has invited you to join ${dto.organizationName}`,
        TemplateName: ElasticMailTemplateNames.MemberInvite, // `.hbs` extension is appended automatically
        Merge: {
          name: `${dto.name || dto.email}`,
          link: dto.link,
          hostName: `${dto.hostName}`,
          organizationName: `${dto.organizationName}`,
          APP_NAME,
          message: dto.message,
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

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { UserModule } from 'src/user/user.module';
import { MemberModule } from 'src/member/member.module';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RoleModule } from 'src/role/role.module';
import { SmsModule } from 'src/sms/sms.module';
import { ConfigModule } from '@nestjs/config';
import { TokenRepository } from './token.repository';
import { Token, TokenSchema } from './schemas/token.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    ConfigModule,
    MailModule,
    SmsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
    PassportModule.register({ defaultStrategy: 'Bearer' }),
    UserModule,
    RoleModule,
    OrganizationModule,
    MemberModule,
    // MemberCommonFieldModule,
    // MembershipPlanModule,
    // SubscriptionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, TokenRepository],
  exports: [
    AuthService,
    JwtModule,
    JwtStrategy,
    LocalStrategy,
    TokenRepository,
  ],
})
export class AuthModule {}

import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AllowUserWithoutOrganization } from './decorators/allow-user-without-organization.decorator';
import { FindUserOrganization } from './dto/find-user-organization..dto';
import { Public } from './decorators/public.decorator';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { TokenRequest } from './interfaces/token-request.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { OrganizationApi } from './decorators/organization-api.decorator';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateOneMemberDto } from 'src/member/dto/create-one-member.dto';

@OrganizationApi()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowUserWithoutOrganization()
  @Get('me')
  me(@Request() req: TokenRequest) {
    return req.user;
  }

  @Get('current-organization')
  currentOrganization(@Request() req: TokenRequest) {
    return req.user.organization;
  }

  @Public()
  @Post('verify-email-or-phone')
  verifyEmailOrPhone(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmailOrPhone(dto);
  }

  @Public()
  @Post('validate-otp')
  validateOTP(@Body() dto: VerifyOtpDto) {
    return this.authService.validateOTP(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.loginToOrganization(dto);
  }

  @AllowUserWithoutOrganization()
  @Post('find-organizations')
  findUserOrganizations(
    @Request() req: TokenRequest,
    @Body() dto: FindUserOrganization,
  ) {
    return this.authService.findUserOrganizations(dto);
  }

  @Public()
  @Post('create-account')
  createNewAccount(@Body() dto: CreateAccountDto) {
    return this.authService.createNewAccount(dto);
  }

  @Post('validate-new-user')
  validateNewUserOTP(
    @Request() request: TokenRequest,
    @Body() dto: VerifyOtpDto,
  ) {
    return this.authService.validateNewUserOTP(request.user._id, dto);
  }

  @Public()
  @Post('register-member')
  registerMember(
    @Request() request: TokenRequest,
    @Body() dto: CreateOneMemberDto,
  ) {
    return this.authService.registerMember(
      request.tokenData.organizationId,
      dto,
    );
  }

  @Public()
  @Post('accept-invite/:organization/:invitation')
  acceptOrganizationInvite(
    @Param('organization') organization: string,
    @Param('invitation') invitation: string,
  ) {
    return this.authService.acceptOrganizationInvite(organization, invitation);
  }

  @Public()
  @Post('decline-invite/:organization/:invitation')
  declineOrganizationInvite(
    @Param('organization') organization: string,
    @Param('invitation') invitation: string,
  ) {
    return this.authService.declineOrganizationInvite(organization, invitation);
  }
}

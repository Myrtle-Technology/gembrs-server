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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowUserWithoutOrganization } from './decorators/allow-user-without-organization.decorator';
import { Public } from './decorators/public.decorator';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { TokenRequest } from './interfaces/token-request.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { OrganizationApi } from './decorators/organization-api.decorator';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateOneMemberDto } from 'src/member/dto/create-one-member.dto';
import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { SetOrganizationDto } from './dto/set-organization.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

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
    return this.authService.sendOtpToEmailOrPhone(dto);
  }

  @Public()
  @Post('validate-otp')
  validateOTP(@Body() dto: VerifyOtpDto) {
    return this.authService.validateOTP(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @ApiOperation({ deprecated: true })
  login(@Body() dto: LoginDto) {
    return this.authService.loginToOrganization(dto);
  }

  @AllowUserWithoutOrganization()
  @Post('find-organizations')
  findUserOrganizations(@Request() req: TokenRequest) {
    return this.authService.findUserOrganizations(req.tokenData.username);
  }

  @Public()
  @Post('create-account')
  @ApiOperation({ deprecated: true })
  createNewAccount(@Body() dto: CreateAccountDto) {
    return this.authService.createNewAccount(dto);
  }

  @AllowUserWithoutOrganization()
  @Post('update-personal-details')
  updatePersonalDetails(
    @Request() req: TokenRequest,
    @Body() dto: UpdateUserDto,
  ) {
    return this.authService.updatePersonalDetails(req.tokenData.userId, dto);
  }

  @AllowUserWithoutOrganization()
  @Post('create-organization')
  createOrganization(
    @Request() req: TokenRequest,
    @Body() dto: CreateOrganizationDto,
  ) {
    return this.authService.createOrganization(req.tokenData.userId, dto);
  }

  @AllowUserWithoutOrganization()
  @Post('set-organization')
  setCurrentOrganization(
    @Request() req: TokenRequest,
    @Body() dto: SetOrganizationDto,
  ) {
    return this.authService.setCurrentOrganization(
      req.tokenData.userId,
      dto.organization,
    );
  }

  @Post('validate-new-user')
  @ApiOperation({ deprecated: true })
  validateNewUserOTP(
    @Request() request: TokenRequest,
    @Body() dto: VerifyOtpDto,
  ) {
    return this.authService.validateNewMemberOTP(request.user._id, dto);
  }

  @Post('validate-member-otp')
  @ApiOperation({ summary: 'Validate Otp for registered members' })
  validateNewMemberOTP(
    @Request() request: TokenRequest,
    @Body() dto: VerifyOtpDto,
  ) {
    return this.authService.validateNewMemberOTP(request.user._id, dto);
  }

  @Public()
  @Post('register-member')
  registerMember(
    @Request() request: TokenRequest,
    @Body() dto: CreateOneMemberDto,
  ) {
    return this.authService.registerMember(request?.organization?.id, dto);
  }

  @Public()
  @Post('accept-invite/:invitation')
  acceptOrganizationInvite(
    @Param('invitation') invitation: string,
    @Body() dto: CreateUserDto,
  ) {
    return this.authService.acceptOrganizationInvite(invitation, dto);
  }

  @Public()
  @Post('decline-invite/:invitation')
  declineOrganizationInvite(@Param('invitation') invitation: string) {
    return this.authService.declineOrganizationInvite(invitation);
  }

  @Public()
  @Post('validate-invite/:invitation')
  validateInvite(@Param('invitation') invitation: string) {
    return this.authService.validateInvite(invitation);
  }
}

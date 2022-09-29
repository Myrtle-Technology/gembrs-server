import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
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

  // @AllowUserWithoutOrganization()
  // @Post('update-personal-details')
  // updatePersonalDetails(
  //   @Request() req: TokenRequest,
  //   @Body() dto: UpdateUserDto,
  // ) {
  //   return this.authService.updatePersonalDetails(req.tokenData.userId, dto);
  // }

  // @AllowUserWithoutOrganization()
  // @Post('create-organization')
  // createOrganization(
  //   @Request() req: TokenRequest,
  //   @Body() dto: CreateOrganizationPasswordDto,
  // ) {
  //   return this.authService.createOrganization(req.tokenData.userId, dto);
  // }

  @OrganizationApi()
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

  // @Public()
  // @OrganizationApi()
  // @Post('register-member')
  // registerMember(@Body() dto: RegisterMember) {
  //   return this.authService.registerMember(dto);
  // }
}

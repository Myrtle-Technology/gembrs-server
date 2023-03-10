import {
  Controller,
  Get,
  Body,
  Param,
  Query,
  Patch,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { AllowUserWithoutOrganization } from 'src/auth/decorators/allow-user-without-organization.decorator';

@AllowUserWithoutOrganization()
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/contacts')
  @ApiOperation({ summary: 'Find all Current User Contacts' })
  findAll(@Request() request: TokenRequest, @Query('search') search: string) {
    return this.service.findUserContacts(request.tokenData.userId, search);
  }

  @Patch('/')
  @ApiOperation({ summary: 'Update User Profile' })
  updateCurrentUser(
    @Request() request: TokenRequest,
    @Body() dto: UpdateUserDto,
  ) {
    return this.service.update(request.tokenData.userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update User Profile OLD', deprecated: true })
  update(
    @Request() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.service.update(request.tokenData.userId, dto);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateMemberPasswordDto } from './dto/update-member-password.dto';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Member' })
  create(@Body() dto: CreateMemberDto) {
    return this.service.createOne(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Members' })
  findAll(@Req() request: TokenRequest) {
    return this.service.findAll(request.user.organization?._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Member' })
  findOne(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.findOne(request.user.organization?._id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Member' })
  update(
    @Req() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.service.update(request.user.organization?._id, id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a Member's password" })
  updatePassword(
    @Req() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMemberPasswordDto,
  ) {
    return this.service.updatePassword(request.user.organization?._id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Member' })
  remove(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.removeOne(request.user.organization?._id, id);
  }
}

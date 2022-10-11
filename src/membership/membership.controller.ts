import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ApiOperation } from '@nestjs/swagger';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';

@Controller('memberships')
export class MembershipController {
  constructor(private readonly service: MembershipService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Membership' })
  create(@Req() request: TokenRequest, @Body() dto: CreateMembershipDto) {
    return this.service.createOne(request.tokenData.organizationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Memberships' })
  findAll(@Req() request: TokenRequest) {
    return this.service.findAll(request.tokenData.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Membership' })
  findOne(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.findOne(request.tokenData.organizationId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Membership' })
  updateOne(
    @Req() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMembershipDto,
  ) {
    return this.service.updateOne(request.tokenData.organizationId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Membership' })
  remove(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.removeOne(request.tokenData.organizationId, id);
  }
}

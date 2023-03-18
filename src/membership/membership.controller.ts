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
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { PaginationQuery } from 'src/shared/paginator/decorator';
import { CursorPaginateQueryOptions } from 'src/shared/paginator/paginate-query-options.decorator';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('Membership')
@Controller('memberships')
export class MembershipController {
  constructor(private readonly service: MembershipService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Membership' })
  create(@Req() request: TokenRequest, @Body() dto: CreateMembershipDto) {
    return this.service.createOne(request.tokenData.organizationId, dto);
  }

  @Get()
  @CursorPaginateQueryOptions()
  @ApiOperation({ summary: 'Find all Memberships' })
  findAll(
    @Req() request: TokenRequest,
    @PaginationQuery() params: Record<string, string>,
  ) {
    return this.service.paginate(request.tokenData.organizationId, params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Membership' })
  findOne(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.findById(request.tokenData.organizationId, id);
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

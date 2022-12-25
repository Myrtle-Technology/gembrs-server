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
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateMemberPasswordDto } from './dto/update-member-password.dto';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { ResourcesEnum } from 'src/role/enums/resources.enum';
import { Permit } from 'src/role/decorators/permit.decorator';
import { PaginationQuery } from 'src/shared/paginator/decorator';
import { CursorPaginateQueryOptions } from 'src/shared/paginator/paginate-query-options.decorator';
import { CreateOneMemberDto } from './dto/create-one-member.dto';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('Members')
@Controller('members')
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Permit({
    resource: ResourcesEnum.Member,
    action: 'create',
    possession: 'own',
  })
  @Post()
  @ApiOperation({ summary: 'Create a Member' })
  create(@Req() request: TokenRequest, @Body() dto: CreateOneMemberDto) {
    return this.service.createOne(request.tokenData.organizationId, dto);
  }

  @Get()
  @CursorPaginateQueryOptions()
  @ApiOperation({ summary: 'Find all Members' })
  @Permit({
    resource: ResourcesEnum.Member,
    action: 'read',
    possession: 'own',
  })
  findAll(
    @Req() request: TokenRequest,
    @PaginationQuery() params: Record<string, string>,
  ) {
    return this.service.findAndPaginate(
      request.tokenData.organizationId,
      params,
    );
  }

  @Permit({
    resource: ResourcesEnum.Member,
    action: 'update',
    possession: 'own',
  })
  @Get(':id')
  @ApiOperation({ summary: 'Find a Member' })
  findOne(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.findOne(request.tokenData.organizationId, id);
  }

  @Permit({
    resource: ResourcesEnum.Member,
    action: 'read',
    possession: 'own',
  })
  @Get(':id/subscription')
  @ApiOperation({ summary: "Find a Member's Subscription" })
  findAllMemberSubscriptions(
    @Req() request: TokenRequest,
    @Param('id') id: string,
  ) {
    return this.service.findAllMemberSubscriptions(
      request.tokenData.organizationId,
      id,
    );
  }

  @Permit({
    resource: ResourcesEnum.Member,
    action: 'read',
    possession: 'own',
  })
  @Get(':id/subscription/active')
  @ApiOperation({ summary: 'Find a Member`s active Subscription' })
  findActiveMemberSubscription(
    @Req() request: TokenRequest,
    @Param('id') id: string,
  ) {
    return this.service.findActiveMemberSubscription(
      request.tokenData.organizationId,
      id,
    );
  }

  @Permit({
    resource: ResourcesEnum.Member,
    action: 'update',
    possession: 'own',
  })
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Member' })
  update(
    @Req() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.service.update(request.tokenData.organizationId, id, dto);
  }

  @Permit({
    resource: ResourcesEnum.Member,
    action: 'update',
    possession: 'own',
  })
  @Patch(':id/password')
  @ApiOperation({ summary: "Update a Member's password" })
  updatePassword(
    @Req() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMemberPasswordDto,
  ) {
    return this.service.updatePassword(
      request.tokenData.organizationId,
      id,
      dto,
    );
  }

  @Permit({
    resource: ResourcesEnum.Member,
    action: 'delete',
    possession: 'own',
  })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Member' })
  remove(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.removeOne(request.tokenData.organizationId, id);
  }
}

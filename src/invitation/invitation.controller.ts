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
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { Permit } from 'src/role/decorators/permit.decorator';
import { ResourcesEnum } from 'src/role/enums/resources.enum';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { CursorPaginateQuery } from 'src/shared/paginator/decorator';
import { CursorPaginateQueryOptions } from 'src/shared/paginator/paginate-query-options.decorator';
import { InviteMemberDto } from 'src/member/dto/invite-member.dto';
import { getSeverBaseUrl } from 'src/shared/helpers/get-server-base-url.helper';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('Invitation')
@Controller('invitation')
export class InvitationController {
  constructor(private readonly service: InvitationService) {}

  @Permit({
    resource: ResourcesEnum.Invitation,
    action: 'create',
    possession: 'own',
  })
  @Post()
  @ApiOperation({ summary: 'Create a Invitation' })
  create(@Body() dto: CreateInvitationDto) {
    return this.service.createOne(dto);
  }

  @Get()
  @CursorPaginateQueryOptions()
  @ApiOperation({ summary: 'Find all Invitations' })
  @Permit({
    resource: ResourcesEnum.Invitation,
    action: 'read',
    possession: 'own',
  })
  findAll(
    @Req() request: TokenRequest,
    @CursorPaginateQuery() params: Record<string, string>,
  ) {
    return this.service.findAll(request.user.organization?._id, params);
  }

  @Permit({
    resource: ResourcesEnum.Invitation,
    action: 'update',
    possession: 'own',
  })
  @Get(':id')
  @ApiOperation({ summary: 'Find a Invitation' })
  findOne(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.findOne(request.user.organization?._id, id);
  }

  @Permit({
    resource: ResourcesEnum.Invitation,
    action: 'update',
    possession: 'own',
  })
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Invitation' })
  update(
    @Req() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateInvitationDto,
  ) {
    return this.service.update(request.user.organization?._id, id, dto);
  }

  @Permit({
    resource: ResourcesEnum.Invitation,
    action: 'delete',
    possession: 'own',
  })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Invitation' })
  remove(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.removeOne(request.user.organization?._id, id);
  }

  @Permit({
    resource: ResourcesEnum.Member,
    action: 'create',
    possession: 'own',
  })
  @Post()
  @ApiOperation({ summary: 'Invite a Member' })
  invite(@Body() dto: InviteMemberDto, @Req() request: TokenRequest) {
    return this.service.inviteMember(
      request.tokenData.organizationId,
      dto,
      getSeverBaseUrl(request),
    );
  }
}

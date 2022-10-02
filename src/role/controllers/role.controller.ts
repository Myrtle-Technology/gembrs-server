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
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Find or Create a Role' })
  create(@Req() request: TokenRequest, @Body() dto: CreateRoleDto) {
    dto.organization = request.tokenData.organizationId;
    return this.service.findOrCreate(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Roles' })
  findAll(@Req() request: TokenRequest) {
    return this.service.findAll(request.tokenData.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Role' })
  findOne(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.findOne(request.tokenData.organizationId, id);
  }

  @Get('/by-slug/:slug')
  @ApiOperation({ summary: 'Find a Role by slug' })
  findBySlug(@Req() request: TokenRequest, @Param('slug') slug: string) {
    return this.service.findBySlug(request.tokenData.organizationId, slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Role' })
  update(
    @Req() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.service.updateOne(request.tokenData.organizationId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Role' })
  remove(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.removeOne(request.tokenData.organizationId, id);
  }
}

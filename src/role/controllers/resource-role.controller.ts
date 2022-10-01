import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResourceRoleService } from '../services/resource-role.service';
import { CreateResourceRoleDto } from '../dto/create-resource-role.dto';
import { UpdateResourceRoleDto } from '../dto/update-resource-role.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('ResourceRole')
@Controller('resource-role')
export class ResourceRoleController {
  constructor(private readonly service: ResourceRoleService) {}

  @Post()
  @ApiOperation({ summary: 'Find or Create a ResourceRole' })
  create(@Body() dto: CreateResourceRoleDto) {
    return this.service.findOrCreate(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all ResourceRoles' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a ResourceRole' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('/by-role/:roleId')
  @ApiOperation({ summary: 'Find a ResourceRole by roleId' })
  findAllByRole(@Param('roleId') roleId: string) {
    return this.service.findAllByRole(roleId);
  }

  @Get('/by-role/:resourceId')
  @ApiOperation({ summary: 'Find a ResourceRole by resourceId' })
  findAllByResource(@Param('resourceId') resourceId: string) {
    return this.service.findAllByRole(resourceId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ResourceRole' })
  update(@Param('id') id: string, @Body() dto: UpdateResourceRoleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ResourceRole' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

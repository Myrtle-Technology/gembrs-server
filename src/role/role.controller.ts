import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Role' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.service.findOrCreate(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Roles' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Role' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('/by-slug/:slug')
  @ApiOperation({ summary: 'Find a Role by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Role' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.service.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Role' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

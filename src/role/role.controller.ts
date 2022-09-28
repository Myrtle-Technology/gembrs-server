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
  @ApiOperation({ summary: 'Fond or Create a Role' })
  create(@Body() dto: CreateRoleDto) {
    return this.service.findOrCreate(dto);
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
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Role' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

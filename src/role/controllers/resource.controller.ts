import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResourceService } from '../services/resource.service';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { UpdateResourceDto } from '../dto/update-resource.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('Resource')
@Controller('resources')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}
  @Post()
  @ApiOperation({ summary: 'Find or Create a Resource' })
  create(@Body() dto: CreateResourceDto) {
    return this.service.findOrCreate(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Resources' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Resource' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('/by-slug/:slug')
  @ApiOperation({ summary: 'Find a Resource by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  /*
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Resource' })
  update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Resource' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
  */
}

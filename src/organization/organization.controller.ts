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
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOperation({ summary: 'Find all Organizations' })
  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @ApiOperation({ summary: 'Create a Organization' })
  @Post()
  create(@Body() dto: CreateOrganizationDto, @Req() request: Request) {
    // dto.ownerId = request.user.id;
    return this.organizationService.createOne(dto);
  }

  @ApiOperation({ summary: 'Find an Organization' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findById(id);
  }

  @ApiOperation({ summary: 'Update an Organization' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.organizationService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete an Organization' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}

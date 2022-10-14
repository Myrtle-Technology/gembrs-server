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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { ResourcesEnum } from 'src/role/enums/resources.enum';
import { Permit } from 'src/role/decorators/permit.decorator';
@ApiBearerAuth()
@OrganizationApi()
@ApiTags('Organization')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Public()
  @ApiOperation({ summary: 'Find all Organizations' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // @Permit({
  //   resource: ResourcesEnum.Organization,
  //   action: 'create',
  //   possession: 'any',
  // })
  // @ApiOperation({ summary: 'Create a Organization' })
  // @Post()
  // create(@Body() dto: CreateOrganizationDto, @Req() request: Request) {
  //   // dto.ownerId = request.user.id;
  //   return this.service.createOne(dto);
  // }

  @Public()
  @ApiOperation({ summary: 'Find an Organization' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Public()
  @ApiOperation({ summary: 'Find an Organization by siteName' })
  @Get(':siteName')
  findBySiteName(@Param('siteName') siteName: string) {
    return this.service.findBySiteName(siteName);
  }

  @Permit({
    resource: ResourcesEnum.Organization,
    action: 'update',
    possession: 'any',
  })
  @ApiOperation({ summary: 'Update an Organization' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.service.update(id, dto);
  }

  @Permit({
    resource: ResourcesEnum.Organization,
    action: 'delete',
    possession: 'any',
  })
  @ApiOperation({ summary: 'Delete an Organization' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

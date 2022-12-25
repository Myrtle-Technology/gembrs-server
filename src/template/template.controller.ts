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
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { Permit } from 'src/role/decorators/permit.decorator';
import { ResourcesEnum } from 'src/role/enums/resources.enum';
import { PaginationQuery } from 'src/shared/paginator/decorator';
import { CursorPaginateQueryOptions } from 'src/shared/paginator/paginate-query-options.decorator';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('Organization templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly service: TemplateService) {}

  @Permit({
    resource: ResourcesEnum.Template,
    action: 'create',
    possession: 'own',
  })
  @Post()
  @ApiOperation({ summary: 'Create a Template for an Organization' })
  create(@Req() request: TokenRequest, @Body() dto: CreateTemplateDto) {
    return this.service.create(
      'organization',
      request.tokenData.organizationId,
      dto,
    );
  }

  @Get()
  @CursorPaginateQueryOptions()
  @ApiOperation({ summary: 'Find all Templates' })
  @Permit({
    resource: ResourcesEnum.Template,
    action: 'read',
    possession: 'own',
  })
  findAll(
    @Req() request: TokenRequest,
    @PaginationQuery() params: Record<string, string>,
  ) {
    return this.service.findAll(
      'organization',
      request.tokenData.organizationId,
      params,
    );
  }

  @Permit({
    resource: ResourcesEnum.Template,
    action: 'update',
    possession: 'own',
  })
  @Get(':id')
  @ApiOperation({ summary: 'Find a Template' })
  findOne(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.findOne(
      'organization',
      request.tokenData.organizationId,
      id,
    );
  }

  @Permit({
    resource: ResourcesEnum.Template,
    action: 'update',
    possession: 'own',
  })
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Template' })
  update(
    @Req() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.service.updateOne(
      'organization',
      request.tokenData.organizationId,
      id,
      dto,
    );
  }

  @Permit({
    resource: ResourcesEnum.Template,
    action: 'delete',
    possession: 'own',
  })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Template' })
  remove(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.removeOne(
      'organization',
      request.tokenData.organizationId,
      id,
    );
  }
}

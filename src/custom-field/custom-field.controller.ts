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
import { ApiOperation } from '@nestjs/swagger';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { CustomFieldService } from './custom-field.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';

@Controller('custom-field')
export class CustomFieldController {
  constructor(private readonly service: CustomFieldService) {}

  @Post()
  @ApiOperation({ summary: 'Create a CustomField' })
  create(@Req() request: TokenRequest, @Body() dto: CreateCustomFieldDto) {
    return this.service.createOne(request.tokenData.organizationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all CustomFields' })
  findAll(@Req() request: TokenRequest) {
    return this.service.findAll(request.tokenData.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a CustomField' })
  findOne(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.findOne(request.tokenData.organizationId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a CustomField' })
  updateOne(
    @Req() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCustomFieldDto,
  ) {
    return this.service.updateOne(request.tokenData.organizationId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a CustomField' })
  remove(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.removeOne(request.tokenData.organizationId, id);
  }
}

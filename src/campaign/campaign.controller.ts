import { TokenRequest } from './../auth/interfaces/token-request.interface';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly service: CampaignService) {}

  @Post()
  create(@Request() request: TokenRequest, @Body() dto: CreateTemplateDto) {
    return this.service.createCampaign(request.tokenData.userId, dto);
  }

  @Get()
  findAll(@Request() request: TokenRequest, @Query() query) {
    return this.service.findAll(request.tokenData.userId, query);
  }

  @Get('/paginate')
  findAndPaginate(@Request() request: TokenRequest, @Query() query) {
    return this.service.findAll(request.tokenData.userId, query);
  }

  @Get(':id')
  findOne(@Request() request: TokenRequest, @Param('id') id: string) {
    return this.service.findById(request.tokenData.userId, id);
  }

  @Patch(':id')
  update(
    @Request() request: TokenRequest,
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.service.updateCampaign(
      request.tokenData.userId,
      id,
      updateCampaignDto,
    );
  }

  @Delete(':id')
  remove(@Request() request: TokenRequest, @Param('id') id: string) {
    return this.service.removeOne(request.tokenData.userId, id);
  }
}

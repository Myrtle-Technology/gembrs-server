import { UpdateCampaignTemplateSmsDto } from './dto/update-campaign-template-sms.dto';
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
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { AllowUserWithoutOrganization } from 'src/auth/decorators/allow-user-without-organization.decorator';

@OrganizationApi()
@AllowUserWithoutOrganization()
@Controller('campaigns')
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

  @Patch(':id/sms')
  updateCampaignSms(
    @Request() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignTemplateSmsDto,
  ) {
    return this.service.updateCampaignSms(request.tokenData.userId, id, dto);
  }
  @Patch(':id')
  update(
    @Request() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.service.updateCampaign(request.tokenData.userId, id, dto);
  }

  @Patch(':id')
  updateAndSendCampaign(
    @Request() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.service.updateAndSendCampaign(
      request.tokenData.userId,
      id,
      dto,
    );
  }

  @Delete(':id')
  remove(@Request() request: TokenRequest, @Param('id') id: string) {
    return this.service.removeOne(request.tokenData.userId, id);
  }
}

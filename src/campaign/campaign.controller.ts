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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@OrganizationApi()
@AllowUserWithoutOrganization()
@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly service: CampaignService) {}

  @ApiOperation({ summary: 'Create Campaign' })
  @Post()
  create(@Request() request: TokenRequest, @Body() dto: CreateTemplateDto) {
    return this.service.createCampaign(request.tokenData.userId, dto);
  }

  @ApiOperation({ summary: 'Find all Campaign' })
  @Get()
  findAll(@Request() request: TokenRequest, @Query() query) {
    return this.service.findAll(request.tokenData.userId, query);
  }

  @ApiOperation({ summary: 'Find all and paginate Campaign' })
  @Get('/paginate')
  findAndPaginate(@Request() request: TokenRequest, @Query() query) {
    return this.service.findAll(request.tokenData.userId, query);
  }

  @ApiOperation({ summary: 'Find one Campaign' })
  @Get(':id')
  findOne(@Request() request: TokenRequest, @Param('id') id: string) {
    return this.service.findById(request.tokenData.userId, id);
  }

  @ApiOperation({ summary: 'Update Campaign SMS' })
  @Patch(':id/sms')
  updateCampaignSms(
    @Request() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignTemplateSmsDto,
  ) {
    return this.service.updateCampaignSms(request.tokenData.userId, id, dto);
  }

  @ApiOperation({ summary: 'Update Campaign' })
  @Patch(':id')
  update(
    @Request() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.service.updateCampaign(request.tokenData.userId, id, dto);
  }

  @ApiOperation({ summary: 'Update and send Campaign to recipients' })
  @Patch(':id/send')
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

  @ApiOperation({ summary: 'Update and send Campaign to recipients' })
  @Delete(':id/recipients')
  async removeCampaignRecipients(
    @Request() request: TokenRequest,
    @Param('id') campaignId: string,
    @Query('recipientIds') recipientIds: string[],
  ) {
    await this.service.removeCampaignRecipients(
      request.tokenData.userId,
      campaignId,
      typeof recipientIds == 'string' ? [recipientIds] : recipientIds,
    );
    return { message: 'Recipients removed successfully' };
  }

  @ApiOperation({ summary: 'Delete Campaign' })
  @Delete(':id')
  async remove(@Request() request: TokenRequest, @Param('id') id: string) {
    await this.service.removeOne(request.tokenData.userId, id);
    return { message: 'Campaign deleted successfully' };
  }

  @ApiOperation({ summary: 'Delete Multiple Campaigns' })
  @Delete('')
  async removeMultiple(
    @Request() request: TokenRequest,
    @Query('ids') ids: Array<string>,
  ) {
    await this.service.removeMany(request.tokenData.userId, ids);
    return { message: 'Campaigns deleted successfully' };
  }
}

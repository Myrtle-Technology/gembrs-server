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
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { Permit } from 'src/role/decorators/permit.decorator';
import { ResourcesEnum } from 'src/role/enums/resources.enum';
import { CursorPaginateQuery } from 'src/shared/paginator/decorator';
import { CursorPaginateQueryOptions } from 'src/shared/paginator/paginate-query-options.decorator';
@ApiBearerAuth()
@OrganizationApi()
@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Permit({
    resource: ResourcesEnum.Subscription,
    action: 'create',
    possession: 'own',
  })
  @Post()
  @ApiOperation({ summary: 'Create a Subscription' })
  create(@Body() dto: CreateSubscriptionDto) {
    return this.service.createOne(dto);
  }

  @Get()
  @CursorPaginateQueryOptions()
  @ApiOperation({ summary: 'Find all Subscriptions' })
  @Permit({
    resource: ResourcesEnum.Subscription,
    action: 'read',
    possession: 'own',
  })
  findAll(
    @Req() request: TokenRequest,
    @CursorPaginateQuery() params: Record<string, string>,
  ) {
    return this.service.findAll(request.user.organization?._id, params);
  }

  @Permit({
    resource: ResourcesEnum.Subscription,
    action: 'update',
    possession: 'own',
  })
  @Get(':id')
  @ApiOperation({ summary: 'Find a Subscription' })
  findOne(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.findOne(request.user.organization?._id, id);
  }

  @Permit({
    resource: ResourcesEnum.Subscription,
    action: 'update',
    possession: 'own',
  })
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Subscription' })
  update(
    @Req() request: TokenRequest,
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.service.update(request.user.organization?._id, id, dto);
  }

  @Permit({
    resource: ResourcesEnum.Subscription,
    action: 'delete',
    possession: 'own',
  })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Subscription' })
  remove(@Req() request: TokenRequest, @Param('id') id: string) {
    return this.service.removeOne(request.user.organization?._id, id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateMemberPasswordDto } from './dto/update-member-password.dto';

@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Member' })
  create(@Body() dto: CreateMemberDto) {
    return this.service.createOne(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Members' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Member' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Member' })
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a Member's password" })
  updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdateMemberPasswordDto,
  ) {
    return this.service.updatePassword(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Members' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

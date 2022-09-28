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

@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Post()
  @ApiOperation({ summary: 'Create a User' })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.service.createOne(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Users' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a User' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a User' })
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.service.update(id, updateMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Users' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Res,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Find all Users' })
  findAll(@Query('filter') filter: any) {
    return this.service.findAll(filter);
  }

  @Post()
  @ApiOperation({ summary: 'Find or Create a User' })
  public async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const user = await this.service.findUpdateOrCreate(createUserDto);
    if (user[1]) {
      return response.status(201).json(user[0]);
    }
    return response.status(200).json(user[0]);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a User' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update User Profile' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a User' })
  public async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'User deleted successfully' };
  }
}

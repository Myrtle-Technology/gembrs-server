import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomFieldService } from './custom-field.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';

@Controller('custom-field')
export class CustomFieldController {
  constructor(private readonly customFieldService: CustomFieldService) {}

  @Post()
  create(@Body() createCustomFieldDto: CreateCustomFieldDto) {
    return this.customFieldService.create(createCustomFieldDto);
  }

  @Get()
  findAll() {
    return this.customFieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customFieldService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomFieldDto: UpdateCustomFieldDto) {
    return this.customFieldService.update(+id, updateCustomFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customFieldService.remove(+id);
  }
}

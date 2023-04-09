import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BaseStatService } from './base-stat.service';
import { CreateBaseStatDto } from './dto/create-baseStat.dto';
import { UpdateBaseStatDto } from './dto/update-baseStat.dto';

@Controller('baseStat')
export class BaseStatController {
  constructor(private readonly baseStatService: BaseStatService) {}

  @Post()
  create(@Body() createStatDto: CreateBaseStatDto) {
    return this.baseStatService.create(createStatDto);
  }

  @Get()
  findAll() {
    return this.baseStatService.findAll();
  }

  @Get(':id/all')
  findOne(@Param('id') id: string) {
    return this.baseStatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatDto: UpdateBaseStatDto) {
    return this.baseStatService.update(+id, updateStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.baseStatService.remove(+id);
  }
}

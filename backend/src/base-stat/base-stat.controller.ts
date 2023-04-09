import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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

  @Get(':itemId/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  findOne(@Param('itemId') itemId: string) {
    return this.baseStatService.findBaseStatsByItemId(+itemId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateStatDto: UpdateBaseStatDto) {
    return this.baseStatService.update(+id, updateStatDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.baseStatService.remove(+id);
  }
}

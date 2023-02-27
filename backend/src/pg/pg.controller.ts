import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PgService } from './pg.service';
import { CreatePgDto } from './dto/create-pg.dto';
import { UpdatePgDto } from './dto/update-pg.dto';

@Controller('pg')
export class PgController {
  constructor(private readonly pgService: PgService) {}

  @Post()
  create(@Body() createPgDto: CreatePgDto) {
    return this.pgService.create(createPgDto);
  }

  @Get()
  findAll() {
    return this.pgService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pgService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePgDto: UpdatePgDto) {
    return this.pgService.update(+id, updatePgDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pgService.remove(+id);
  }
}

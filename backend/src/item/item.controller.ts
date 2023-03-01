import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemDto } from './dto/query-item.dto';
import { ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  @ApiQuery({
    type: QueryItemDto,
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Query() itemQuery: QueryItemDto) {
    return this.itemService.findAll(itemQuery);
  }

  @Get('market')
  @ApiQuery({
    type: QueryItemDto,
  })
  @UseGuards(JwtAuthGuard)
  getMarket(@Query() itemQuery: QueryItemDto) {
    return this.itemService.getMarket(itemQuery);
  }

  @Get('/user/:userId/:existingItemId')
  @UseGuards(JwtAuthGuard)
  findUserItem(
    @Param('userId') userId: number,
    @Param('existingItemId') existingItemId: number,
  ) {
    return this.itemService.findUserItem(userId, existingItemId);
  }

  @Get('/user/:userId/')
  @UseGuards(JwtAuthGuard)
  findUserItems(@Param('userId') userId: number) {
    return this.itemService.findUserItems(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}

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
import {
  JwtAuthGuard,
  JwtOptionalAuthGuard,
} from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from 'src/user/user.decorator';
import { User } from 'src/user/user.entity';

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

  @Get('base')
  @ApiQuery({
    type: QueryItemDto,
  })
  @UseGuards(JwtOptionalAuthGuard)
  getBase() {
    return this.itemService.getBase();
  }

  @Get('market')
  @ApiQuery({
    type: QueryItemDto,
  })
  @UseGuards(JwtOptionalAuthGuard)
  getMarket(@Query() itemQuery: QueryItemDto, @ReqUser() user: User) {
    return this.itemService.getMarket(itemQuery, user);
  }

  @Get('/user/:userId/:existingItemId')
  @UseGuards(JwtOptionalAuthGuard)
  findUserItem(
    @Param('userId') userId: number,
    @Param('existingItemId') existingItemId: number,
    @ReqUser() user: User,
  ) {
    return this.itemService.findUserItem(userId, existingItemId, user);
  }

  @Get('/user/:userId/')
  @ApiQuery({
    type: QueryItemDto,
  })
  @UseGuards(JwtOptionalAuthGuard)
  findUserItems(
    @Query() itemQuery: QueryItemDto,
    @Param('userId') userId: number,
    @ReqUser() user: User,
  ) {
    return this.itemService.findUserItems(userId, itemQuery, user);
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

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExistingItemService } from './existing-item.service';
import { CreateExistingItemDto } from './dto/create-existing-item.dto';
import { UpdateExistingItemDto } from './dto/update-existing-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from 'src/user/user.decorator';
import { User } from 'src/user/user.entity';
import { FilterExistingItemDto } from './dto/filter-existing-item.dto';
import { QueryItemDto } from 'src/item/dto/query-item.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AdminQueryExistingItemDto } from './dto/admin-query-existing-item.dto';

@Controller('existing-item')
export class ExistingItemController {
  constructor(private readonly existingItemService: ExistingItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @ReqUser() user: User,
    @Body() createExistingItemDto: CreateExistingItemDto,
  ) {
    return await this.existingItemService.create(createExistingItemDto, user);
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // findAll(@ReqUser() user: User, @Query() filterExistingItemDto: QueryItemDto) {
  //   return this.existingItemService.findAll(filterExistingItemDto, user);
  // }

  // ADMIN
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/')
  async findAll(@Query() query: AdminQueryExistingItemDto) {
    return await this.existingItemService.findAll(query);
  }

  @Get('/item/:itemId/user/:userId')
  @UseGuards(JwtAuthGuard)
  findAllByItemIdAndUserId(
    @ReqUser() user: User,
    @Param('itemId') itemId: string,
    @Param('userId') userId: string,
    @Query() filterExistingItemDto: QueryItemDto,
  ) {
    return this.existingItemService.findAllByItemIdAndUserId(
      filterExistingItemDto,
      +itemId,
      +userId,
      user,
    );
  }

  @Get('/count/')
  @UseGuards(JwtAuthGuard)
  count(@ReqUser() user: User) {
    return this.existingItemService.count(user);
  }

  @Get('/item/:itemId')
  @UseGuards(JwtAuthGuard)
  findAllByItemId(
    @ReqUser() user: User,
    @Param('itemId') itemId: string,
    @Query() filterExistingItemDto: QueryItemDto,
  ) {
    return this.existingItemService.findAllByItemIdAndUserId(
      filterExistingItemDto,
      +itemId,
      null,
      user,
    );
  }

  @Get('similar/:id')
  findSimilar(@Param('id') id: string) {
    return this.existingItemService.findSimilar(+id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.existingItemService.findOne(+id);
  }
  @Patch('/:id/discord/:bool')
  @UseGuards(JwtAuthGuard)
  async changeDiscordNotification(
    @ReqUser() user: User,
    @Param('bool') bool: string,
    @Param('id') id: string,
  ) {
    return await this.existingItemService.changeDiscordNotification(
      +id,
      bool === 'true' ? true : false,
      user,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @ReqUser() user: User,
    @Body() updateExistingItemDto: UpdateExistingItemDto,
  ) {
    return this.existingItemService.update(+id, updateExistingItemDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.existingItemService.remove(+id);
  }
}

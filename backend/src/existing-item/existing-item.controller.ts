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
  Put,
} from '@nestjs/common';
import { ExistingItemService } from './existing-item.service';
import { CreateExistingItemDto } from './dto/create-existing-item.dto';
import { UpdateExistingItemDto } from './dto/update-existing-item.dto';
import {
  JwtAuthGuard,
  JwtOptionalAuthGuard,
} from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from 'src/user/user.decorator';
import { User } from 'src/user/user.entity';
import { FilterExistingItemDto } from './dto/filter-existing-item.dto';
import { QueryItemDto } from 'src/item/dto/query-item.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AdminQueryExistingItemDto } from './dto/admin-query-existing-item.dto';
import { ExistingItem } from './existing-item.entity';
import { SimilarExistingItemDto } from './dto/similar-existing-item.dto';

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
  @UseGuards(JwtOptionalAuthGuard)
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
  @UseGuards(JwtOptionalAuthGuard)
  count(@ReqUser() user: User) {
    return this.existingItemService.count(user);
  }

  @Get('/item/:itemId')
  @UseGuards(JwtOptionalAuthGuard)
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

  @Get('similar/:id/:offerType')
  @UseGuards(JwtAuthGuard)
  findSimilarById(
    @Param('id') id: string,
    @ReqUser() user: User,
    @Param('offerType') offerType: 'WTS' | 'WTB',
  ) {
    return this.existingItemService.findSimilarById(+id, user, offerType);
  }

  @Put('similar/:offerType')
  @UseGuards(JwtAuthGuard)
  findSimilar(
    @ReqUser() user: User,
    @Param('offerType') offerType: 'WTS' | 'WTB',
    @Body() similarExistingItem: SimilarExistingItemDto,
  ) {
    return this.existingItemService.findSimilar(
      similarExistingItem,
      user,
      offerType,
    );
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

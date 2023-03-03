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

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @ReqUser() user: User,
    @Query() filterExistingItemDto: FilterExistingItemDto,
  ) {
    return this.existingItemService.findAll(filterExistingItemDto, user);
  }

  @Get('/item/:itemId')
  @UseGuards(JwtAuthGuard)
  findAllByItemId(
    @ReqUser() user: User,
    @Param('itemId') itemId: string,
    @Query() filterExistingItemDto: FilterExistingItemDto,
  ) {
    return this.existingItemService.findAllByItemId(
      filterExistingItemDto,
      +itemId,
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExistingItemDto: UpdateExistingItemDto,
  ) {
    return this.existingItemService.update(+id, updateExistingItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.existingItemService.remove(+id);
  }
}

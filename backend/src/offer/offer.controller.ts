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
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import {
  JwtAuthGuard,
  JwtOptionalAuthGuard,
} from 'src/auth/guards/jwt-auth.guard';
import { QueryOfferDto } from './dto/query-offer.dto';
import { User } from 'src/user/user.entity';
import { ReqUser } from 'src/user/user.decorator';

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@ReqUser() user: User, @Body() createOfferDto: CreateOfferDto) {
    return this.offerService.create(createOfferDto, user);
  }

  @Get()
  @UseGuards(JwtOptionalAuthGuard)
  filter(@ReqUser() user: User, @Query() query: QueryOfferDto) {
    return this.offerService.filter(query, user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.offerService.findOne(+id);
  // }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offerService.update(+id, updateOfferDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.offerService.remove(+id);
  }
}

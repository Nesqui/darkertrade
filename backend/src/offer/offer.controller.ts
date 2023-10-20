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
import { AcceptOfferPairDto } from './dto/accept-offer-pair.dto';

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@ReqUser() user: User, @Body() createOfferDto: CreateOfferDto) {
    return this.offerService.create(createOfferDto, user);
  }

  @Post('/accept/offerPair/:offerPairId')
  @UseGuards(JwtAuthGuard)
  acceptOfferPair(
    @ReqUser() user: User,
    @Param('offerPairId') offerPairId: string,
    @Body() acceptOfferPairDto: AcceptOfferPairDto,
  ) {
    return this.offerService.acceptOfferPair(
      +offerPairId,
      acceptOfferPairDto,
      user,
    );
  }

  @Get()
  @UseGuards(JwtOptionalAuthGuard)
  filter(@ReqUser() user: User, @Query() query: QueryOfferDto) {
    return this.offerService.filter(query, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
    @ReqUser() user: User,
  ) {
    return this.offerService.update(+id, updateOfferDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @ReqUser() user: User) {
    return this.offerService.remove(+id, user);
  }
}

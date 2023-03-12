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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from 'src/user/user.decorator';
import { User } from 'src/user/user.entity';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { QueryBidDto } from './dto/query-bid.dto';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@ReqUser() user: User, @Body() createBidDto: CreateBidDto) {
    return this.bidService.create(createBidDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  filter(@ReqUser() user: User, @Query() query: QueryBidDto,) {
    return this.bidService.filter(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bidService.findOne(+id);
  }

  @Patch(':id')
  accept(@Param('id') id: string, @ReqUser() user: User) {
    return this.bidService.accept(+id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@ReqUser() user: User, @Param('id') id: string) {
    return this.bidService.remove(+id, user);
  }
}

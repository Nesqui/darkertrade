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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import {
  JwtAuthGuard,
  JwtOptionalAuthGuard,
} from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from './user.decorator';
import { User } from './user.entity';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AdminQueryUserDto } from './dto/admin-query-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('/nickname/:nickname')
  @UseGuards(JwtOptionalAuthGuard)
  async findOneByNickname(@Param('nickname') nickname: string) {
    return await this.userService.findByNickname(nickname);
  }

  @Get('/hash/:hash')
  async findOneByHash(@Param('hash') hash: string) {
    return await this.userService.findByHash(hash);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/')
  async findAll(@Query() query: AdminQueryUserDto) {
    return await this.userService.findAll(query);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('/ban/:userId/:days')
  async Ban(@Param('userId') userId: number, @Param('days') days: number) {
    return await this.userService.ban(userId, days);
  }

  // ADMIN
  @Patch('discord/:bool')
  @UseGuards(JwtAuthGuard)
  async changeDiscordNotification(
    @ReqUser() user: User,
    @Param('bool') bool: string,
  ) {
    return await this.userService.changeDiscordNotification(
      bool === 'true' ? true : false,
      user,
    );
  }

  @Patch('')
  async update(@Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

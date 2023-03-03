import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import DiscordGateway from './discord.gateway';
import { CreateDiscordDto } from './dto/create-discord.dto';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordGateway: DiscordGateway) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() createDiscordDto: CreateDiscordDto) {
    return this.discordGateway.zalupa(createDiscordDto);
  }
}

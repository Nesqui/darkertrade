import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DiscordGateway } from 'src/discord/discord.gateway';
import { DiscordBotModule } from 'src/discord/discord.module';
import { usersProviders } from 'src/user/user.providers';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    DiscordBotModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, ...usersProviders],
  exports: [AuthService],
})
export class AuthModule {}

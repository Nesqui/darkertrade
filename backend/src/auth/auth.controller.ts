import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryUserDto } from 'src/user/dto/query-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('/signin')
  @ApiQuery({
    type: QueryUserDto,
  })
  @ApiOperation({ summary: 'Sign in' })
  async auth(@Query() userQuery: QueryUserDto) {
    const user = await this.authService.validateUser(userQuery);
    if (!user) throw new UnauthorizedException('Login or password incorrect');
    const currentTime = new Date().getTime();
    if (user.bannedUntil) {
      const banTime = new Date(user.bannedUntil).getTime();
      if (currentTime < banTime) {
        throw new UnauthorizedException({
          message: `User is Banned until ${new Date(
            user.bannedUntil,
          ).toLocaleString()}`,
        });
      }
      await this.userService.banLift(user.id);
    }
    return this.authService.login(user);
  }
}

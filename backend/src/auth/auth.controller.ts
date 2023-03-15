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
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/signin')
  @ApiQuery({
    type: QueryUserDto,
  })
  @ApiOperation({ summary: 'Sign in' })
  async auth(@Query() userQuery: QueryUserDto) {
    const user = await this.authService.validateUser(userQuery);
    if (!user) throw new UnauthorizedException('Login or password incorrect');

    return this.authService.login(user);
  }
}

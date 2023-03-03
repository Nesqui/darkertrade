import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { QueryUserDto } from 'src/user/dto/query-user.dto';
import { User } from 'src/user/user.entity';
import { DiscordGateway } from 'src/discord/discord.gateway';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly discordGateway: DiscordGateway,
  ) {}

  async validateUser(user: QueryUserDto): Promise<any> {
    // this.discordService.zalupa('giga');
    const res = await this.usersService.findOne(user);
    console.log(res);
    if (res?.password === user.password) return res;

    return null;
  }

  async login(user: User) {
    console.log(user);

    return {
      user,
      jwtToken: this.jwtService.sign(user.dataValues),
    };
  }
}

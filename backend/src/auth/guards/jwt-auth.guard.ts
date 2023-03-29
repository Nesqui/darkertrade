import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';
import online from 'src/online-users';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  bearerCheck(req: any) {
    try {
      const authHeader = req.headers.authorization;
      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new Error('Invalid token');
      }
      req.user = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      return true;
    } catch (e) {
      console.log('Auth error', e);

      throw new UnauthorizedException({ message: 'User not authorized' });
    }
  }

  async banCheck(userId: number) {
    const currentHour = new Date().getHours();
    if (currentHour != online.lastQuery) {
      online.clearUsers();
      online.updateLastQuery();
      await this.userService.clearOnline();
    }
    if (online.users.includes(userId)) return true;

    const currentUser = await this.userService.findByPk(userId);
    if (!currentUser) throw new ForbiddenException('user not found');

    const currentTime = new Date().getTime();

    if (currentUser.bannedUntil) {
      const banTime = new Date(currentUser.bannedUntil).getTime();

      if (currentTime < banTime) {
        throw new UnauthorizedException({
          message: `User is banned until ${new Date(
            currentUser.bannedUntil,
          ).toLocaleString()}`,
        });
      }
      await this.userService.banLift(userId);
    }

    online.users.push(userId);
    await this.userService.makeOnline(userId);
    return true;
  }

  async canActivate(context: ExecutionContext | any): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!this.bearerCheck(req)) return false;
    return await this.banCheck(req.user.id);
  }
}

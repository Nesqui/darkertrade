import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private hashedUsers = [];
  private lastQuery = new Date().getHours();
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  canActivate(
    context: ExecutionContext | any,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new Error('Invalid token');
      }
      req.user = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });

      const currentHour = new Date().getHours();
      if (currentHour != this.lastQuery) {
        this.hashedUsers = [];
      }
      this.lastQuery = currentHour;

      if (!this.hashedUsers.includes(req.user.id)) {
        this.hashedUsers.push(req.user.id);
      } else {
        return true;
      }

      const currentTime = new Date().getTime();
      if (req.user.bannedUntil) {
        const banTime = new Date(req.user.bannedUntil).getTime();
        if (currentTime < banTime) {
          throw new UnauthorizedException({
            message: `User is Banned until ${banTime.toLocaleString()}`,
          });
        }
        this.userService.banLift(req.user.id);
      }
      return true;
    } catch (e) {
      console.log('Auth error', e);

      throw new UnauthorizedException({ message: 'User not authorized' });
    }
  }
}

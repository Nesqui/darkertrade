import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';
import online from 'src/online-users';

const banCheck = async (userId: number, userService: UserService) => {
  const currentHour = new Date().getHours();
  if (currentHour != online.lastQuery) {
    online.clearUsers();
    online.updateLastQuery();
    await userService.clearOnline();
  }
  if (online.users.includes(userId)) return true;

  const currentUser = await userService.findByPk(userId);
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
    await userService.banLift(userId);
  }

  online.users.push(userId);
  await userService.makeOnline(userId);
  return true;
};

const bearerCheck = (req: any, jwtService: JwtService, optional = false) => {
  try {
    const authHeader = req.headers.authorization;
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new Error('Invalid token');
    }
    req.user = jwtService.verify(token, {
      secret: jwtConstants.secret,
    });
    return true;
  } catch (e) {
    if (!optional)
      throw new UnauthorizedException({ message: 'User not authorized' });
    req.user = undefined;
    return true;
  }
};
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext | any): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!bearerCheck(req, this.jwtService)) return false;
    return await banCheck(req.user.id, this.userService);
  }
}

@Injectable()
export class JwtOptionalAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext | any): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    bearerCheck(req, this.jwtService, true);
    if (req.user) return await banCheck(req.user.id, this.userService);
    return true;
  }
}

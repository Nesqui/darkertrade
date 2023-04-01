import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext | any): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = await this.userService.findByPk(req.user.id);
    return user.isAdmin;
  }
}

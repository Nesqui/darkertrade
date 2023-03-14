import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtWSAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // if (!context.args[1].token)
    //   throw new WsException("Token not found")
    const client: Socket = context.switchToWs().getClient<Socket>();

    try {
      const args = context.getArgs();
      const authToken = args[1].token;

      if (!authToken) {
        client.emit('authRequired');
        client.disconnect();
        return false;
      }

      args[1].user = this.jwtService.verify(authToken, {
        secret: jwtConstants.secret,
      });
      return true;
    } catch (e) {
      console.log('Auth error', 'Token invalid');
      client.emit('authRequired');
      client.disconnect();
    }
  }
}

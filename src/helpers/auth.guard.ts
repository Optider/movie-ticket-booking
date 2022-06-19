import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest(req): boolean | Promise<boolean> {
    // Verify the JWT token
    let jwtService = new JwtService();
    const tokenVerified = jwtService.verify(req.headers.token, {
      secret: 'SUPER_SECRET',
    });

    const configService = new ConfigService();
    const token = configService.get<string>('TOKEN');

    return token === tokenVerified;
  }
}

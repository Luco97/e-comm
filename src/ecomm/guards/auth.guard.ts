import { Request } from 'express';
import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UtilsService } from '@shared/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _utilsService: UtilsService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token: string = req.headers.authorization?.replace(/Bearer /g, '');
    return this._utilsService.validateToken(token);
  }
}

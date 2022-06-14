import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UtilsService } from '@shared/auth';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private _jwtServce: UtilsService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}

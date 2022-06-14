import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UtilsService } from '@shared/auth';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private _reflector: Reflector,
    private _jwtServce: UtilsService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const roles = this._reflector.get<string[]>('roles', context.getHandler());
    // console.log(roles);
    return true;
  }
}

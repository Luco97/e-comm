import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Observable, from, map, tap, of, forkJoin } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UtilsService } from '@shared/auth';
import { RolesService } from '@shared/roles';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private _reflector: Reflector,
    private _jwtSerivce: UtilsService,
    private _roleService: RolesService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const roles = this._reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return of(true);
    const uuid: number = this._jwtSerivce.userUuid(
      req.headers.authorization?.replace(/Bearer /g, ''),
    );
    // console.log('----> ', roles, ' ---> [', uuid, ']');
    const ObsArray: Observable<boolean>[] = [];
    roles.forEach((role) => {
      ObsArray.push(
        from(this._roleService.findByRole(role, uuid)).pipe(
          map((data) => (data ? true : false)),
          tap((data) => console.log(data)),
        ),
      );
    });
    return forkJoin(ObsArray).pipe(map((data) => data.includes(true)));
    // return from(this._roleService.findByRole(role, uuid)).pipe(
    //   map((data) => (data ? true : false)),
    //   tap((data) => console.log(data)),
    // );
  }
}

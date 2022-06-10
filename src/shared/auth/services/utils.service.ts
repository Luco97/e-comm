import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, map, Observable } from 'rxjs';

@Injectable()
export class UtilsService {
  constructor(private _jwtService: JwtService) {}

  genJWT(object: { uuid: string; name: string }): Observable<string> {
    const { uuid, name } = object;
    return from(
      this._jwtService.signAsync({
        sub: name,
        context: {
          username: name,
          extra: uuid,
        },
      }),
    );
  }

  validateToken(token: string): Observable<boolean> {
    return from(
      this._jwtService.verifyAsync(token, { secret: process.env.SECRET_KEY }),
    ).pipe(
      map((validation) => {
        if (validation?.context?.username && validation?.context?.extra)
          return true;
        return false;
      }),
    );
  }

  userUuid(token: string): Observable<string> {
    return from(
      this._jwtService.verifyAsync(token, { secret: process.env.SECRET_KEY }),
    ).pipe(
      map((validation) => {
        if (validation?.context?.username && validation?.context?.extra)
          return validation?.context?.extra;
        return '';
      }),
    );
  }
}

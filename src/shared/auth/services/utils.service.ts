import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, map, Observable } from 'rxjs';

@Injectable()
export class UtilsService {
  constructor(private _jwtService: JwtService) {}

  genJWT(object: { uuid: string; name: string }): string {
    const { uuid, name } = object;
    return this._jwtService.sign({
      sub: name,
      context: {
        username: name,
        extra: uuid,
      },
    });
  }

  validateToken(token: string): boolean {
    try {
      const validation = this._jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      if (validation?.context?.username && validation?.context?.extra)
        return true;
    } catch (error) {
      return false;
    }
  }

  userUuid(token: string): string {
    try {
      const payload = this._jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      if (payload?.context?.username && payload?.context?.extra)
        return payload?.context?.extra;
    } catch (error) {
      return '';
    }
  }
}

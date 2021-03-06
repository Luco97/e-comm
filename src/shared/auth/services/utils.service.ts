import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
      return '00000000-0000-0000-0000-000000000000';
    }
  }

  payload(token: string): { uuid: string; username: string } {
    try {
      const payload = this._jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      if (payload?.context?.username && payload?.context?.extra)
        return {
          uuid: payload?.context?.extra,
          username: payload?.context?.username,
        };
    } catch (error) {
      return { uuid: '00000000-0000-0000-0000-000000000000', username: '' };
    }
  }
}

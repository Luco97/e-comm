import {
  Put,
  Res,
  Body,
  Post,
  Headers,
  UseGuards,
  Controller,
} from '@nestjs/common';

import { Response } from 'express';
import { tap, from } from 'rxjs';

import { response } from '@ecomm/interfaces';
import { Login, Sign, Update } from '@ecomm/dtos/user';
import { AuthGuard } from '../../guards/auth.guard';
import { UserService } from '../services/user.service';

@Controller('auth')
export class AuthController {
  constructor(private _userService: UserService) {}
  @Post('sign')
  signIn(@Body() signBody: Sign, @Res() resp: Response<response>) {
    from(this._userService.register(signBody))
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }

  @Post('login')
  logIn(@Body() loginBody: Login, @Res() resp: Response<response>) {
    from(this._userService.login(loginBody))
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }

  @Put('update')
  @UseGuards(AuthGuard)
  updateFields(
    @Headers('authorization') auth: string,
    @Body() updateBody: Update,
    @Res() resp: Response<response>,
  ) {
    const token: string = auth.replace(/Bearer /g, '');
    from(this._userService.updateInfo(updateBody, token))
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }
}

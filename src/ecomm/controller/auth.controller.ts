import {
  Get,
  Put,
  Res,
  Body,
  Post,
  Param,
  UseGuards,
  Controller,
} from '@nestjs/common';

import { tap } from 'rxjs';
import { Response } from 'express';

import { response } from '@ecomm/interfaces';
import { AuthGuard } from '../../guards/auth.guard';
import { Token } from '../decorators/token.decorator';
import { UserService } from '../services/user.service';
import { Login, Sign, Update, UpdatePassword } from '@ecomm/dtos/user';

@Controller('auth')
export class AuthController {
  constructor(private _userService: UserService) {}
  @Post('sign')
  signIn(@Body() signBody: Sign, @Res() resp: Response<response>) {
    this._userService
      .register(signBody)
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }

  @Post('login')
  logIn(@Body() loginBody: Login, @Res() resp: Response<response>) {
    this._userService
      .login(loginBody)
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }

  @Put('update')
  @UseGuards(AuthGuard)
  updateFields(
    @Token() token: string,
    @Body() updateBody: Update,
    @Res() resp: Response<response>,
  ) {
    this._userService
      .updateInfo(updateBody, token)
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }

  @Put('update/password')
  @UseGuards(AuthGuard)
  updatePassword(
    @Token() token: string,
    @Body() updateBody: UpdatePassword,
    @Res() resp: Response<response>,
  ) {}

  @Get('validate/:role')
  @UseGuards(AuthGuard)
  isValid(
    @Token() token: string,
    @Param('role') role: string,
    @Res() resp: Response<response>,
  ) {
    this._userService
      .validateUser(token, role)
      .pipe(tap((data) => resp.status(data.status).json(data)))
      .subscribe();
  }
}

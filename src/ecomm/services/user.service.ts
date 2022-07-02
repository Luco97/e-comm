import { Injectable, HttpStatus } from '@nestjs/common';

import { compare } from 'bcrypt';
import { from, Observable, mergeMap, of, map } from 'rxjs';

import { UtilsService } from '@shared/auth';
import { response } from '@ecomm/interfaces';
import { Login, Sign } from '@ecomm/dtos/user';
import { Update } from '../classes/user/update';
import { RoleEntityService } from '@database/models/role';
import { UserEntity, UserEntityService } from '@database/models/user';

@Injectable()
export class UserService {
  constructor(
    private _userEntityService: UserEntityService,
    private _roleEntityService: RoleEntityService,
    private _utilsService: UtilsService,
  ) {}
  register(parameters: Sign): Observable<response> {
    const { email, name, image_src, last_name, password } = parameters;
    return from(this._userEntityService.findMail(email)).pipe(
      mergeMap((user) =>
        user?.email
          ? of<response>({
              status: HttpStatus.CONFLICT,
              message: 'email on use',
            })
          : from(this._roleEntityService.findRole('basic')).pipe(
              mergeMap((role) =>
                from(
                  this._userEntityService.create({
                    role,
                    name,
                    email,
                    password,
                    last_name,
                    image_src,
                  }),
                ).pipe(
                  map<UserEntity, response>(() => ({
                    status: HttpStatus.CREATED,
                    message: 'user created',
                  })),
                ),
              ),
            ),
      ),
    );
  }

  login(parameters: Login): Observable<response> {
    const { email, password } = parameters;
    return from(this._userEntityService.findUser(email)).pipe(
      mergeMap(({ uuid, name, password: userHash }) =>
        !uuid
          ? of<response>({
              status: HttpStatus.OK,
              message: 'invalid credentials',
            })
          : from(compare(password, userHash)).pipe(
              map<boolean, response>((passCompare) => {
                if (!passCompare)
                  return {
                    status: HttpStatus.OK,
                    message: 'inssvalid credentials',
                  };
                const token: string = this._utilsService.genJWT({ uuid, name });
                return {
                  status: HttpStatus.ACCEPTED,
                  message: 'welcome',
                  response: { token },
                };
              }),
            ),
      ),
    );
  }

  updateInfo(parameters: Update, token: string): Observable<response> {
    const { image_src, last_name, name } = parameters;
    const uuid = this._utilsService.userUuid(token);

    return from(this._userEntityService.findOne(uuid)).pipe(
      mergeMap((user) =>
        !user
          ? of<response>({
              status: HttpStatus.NOT_FOUND,
              message: `user = '${uuid}' not found`,
            })
          : from(
              this._userEntityService.update({
                uuid: user.uuid,
                name: name || user.name,
                last_name: last_name || user.last_name,
                image_src: image_src || user.image_src,
              }),
            ).pipe(
              map<UserEntity, response>(() => ({
                status: HttpStatus.OK,
                message: 'user updated',
              })),
            ),
      ),
    );
  }
}

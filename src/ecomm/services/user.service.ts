import { compare } from 'bcrypt';
import { Injectable, HttpStatus } from '@nestjs/common';
import { UtilsService } from '@shared/auth';
import { Login, Sign } from '@ecomm/dtos/user';
import { Update } from '../classes/user/update';
import { response } from '../interfaces/response';
import { RoleEntityService } from '@database/models/role';
import { UserEntityService } from '@database/models/user';

@Injectable()
export class UserService {
  constructor(
    private _userEntityService: UserEntityService,
    private _roleEntityService: RoleEntityService,
    private _utilsService: UtilsService,
  ) {}
  async register(parameters: Sign): Promise<response> {
    const { email, name, image_src, last_name, password } = parameters;
    const user = await this._userEntityService.findMail(email);
    if (user?.uuid)
      return { status: HttpStatus.CONFLICT, message: 'email on use' };
    const role = await this._roleEntityService.findRole('basic');
    await this._userEntityService.create({
      email,
      name,
      last_name,
      password,
      image_src,
      role,
    });
    return {
      status: HttpStatus.CREATED,
      message: 'user created',
    };
  }

  async login(parameters: Login): Promise<response> {
    const { email, password } = parameters;
    const {
      uuid,
      name,
      password: userHash,
    } = await this._userEntityService.findMail(email);
    if (!uuid) return { status: HttpStatus.OK, message: 'invalid credentials' };
    const passCompare = await compare(password, userHash);
    if (!passCompare)
      return { status: HttpStatus.OK, message: 'inssvalid credentials' };
    const token: string = this._utilsService.genJWT({ uuid, name });
    return {
      status: HttpStatus.ACCEPTED,
      message: 'welcome',
      response: {
        token,
      },
    };
  }

  async updateInfo(parameters: Update, token: string): Promise<response> {
    const { image_src, last_name, name } = parameters;
    const uuid = this._utilsService.userUuid(token);
    const user = await this._userEntityService.findOne(uuid);
    if (!user)
      return {
        status: HttpStatus.NOT_FOUND,
        message: `user = '${uuid}' not found`,
      };
    user.name = name || user.name;
    user.image_src = image_src || user.image_src;
    user.last_name = last_name || user.last_name;
    const updateUser = await this._userEntityService.update(user);
    return {
      status: HttpStatus.OK,
      message: 'user updated',
    };
  }
}

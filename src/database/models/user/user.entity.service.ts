import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserEntityService {
  constructor(
    @InjectRepository(UserEntity)
    private _userRepo: Repository<UserEntity>,
  ) {}
  create(newUser: DeepPartial<UserEntity>): Promise<UserEntity> {
    const user = this._userRepo.create(newUser);
    return this._userRepo.save(user);
  }
  findOne(uuid: string): Promise<UserEntity> {
    return this._userRepo
      .createQueryBuilder('user')
      .where('user.uuid = :uuid', { uuid })
      .getOne();
  }
  update(user: UserEntity): Promise<UserEntity> {
    const updateUser = this._userRepo.create(user);
    return this._userRepo.save(updateUser);
  }
  findMail(email: string): Promise<UserEntity> {
    return this._userRepo
      .createQueryBuilder('user')
      .select(['user.email'])
      .where('user.email = :email', { email })
      .getOne();
  }
  findUser(email: string): Promise<UserEntity> {
    return this._userRepo
      .createQueryBuilder('user')
      .select(['user.uuid', 'user.email', 'user.password', 'user.name'])
      .where('user.email = :email', { email })
      .getOne();
  }
}

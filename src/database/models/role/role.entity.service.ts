import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { from, map } from 'rxjs';

@Injectable()
export class RoleEntityService {
  constructor(
    @InjectRepository(RoleEntity)
    private _roleRepo: Repository<RoleEntity>,
  ) {}
  findRole(type: string) {
    return this._roleRepo
      .createQueryBuilder('role')
      .where('role.type = :type', { type })
      .getOne();
  }

  findByRole(type: string, uuid: string) {
    return this._roleRepo
      .createQueryBuilder('role')
      .leftJoin('role.user', 'user', 'user.uuid = :uuid', { uuid })
      .where('role.type = :type', { type })
      .andWhere('user.uuid = :uuid', { uuid })
      .getCount();
    try {
    } catch (error) {
      return new Promise<number>((resolve) => 0);
    }
  }
}

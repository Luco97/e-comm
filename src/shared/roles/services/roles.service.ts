import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '@database/models/role';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private _roleRepo: Repository<RoleEntity>,
  ) {}

  findByRole(type: string, uuid: number) {
    try {
      return this._roleRepo
        .createQueryBuilder('role')
        .leftJoin('role.user', 'user', 'user.uuid = :uuid', { uuid })
        .where('role.type = :type AND user.uuid = :uuid', { type, uuid })
        .getCount();
    } catch (error) {
      return new Promise<number>((resolve) => 0);
    }
  }
}

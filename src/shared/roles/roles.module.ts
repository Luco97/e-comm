import { RoleEntity } from '@database/models/role';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './services/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  exports: [RolesService],
  providers: [RolesService],
})
export class RolesModule {}

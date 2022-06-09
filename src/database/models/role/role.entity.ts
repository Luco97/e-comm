import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({
  name: 'role',
})
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'uuid',
  })
  uuid: string;

  @Column({
    name: 'type',
    type: 'varchar',
    default: 'basic',
    nullable: false,
  })
  type: string;

  @OneToMany(() => UserEntity, (users) => users.role)
  user: UserEntity[];
}

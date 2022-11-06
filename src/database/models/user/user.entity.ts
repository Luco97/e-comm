import { genSalt, hash } from 'bcrypt';
import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  PrimaryColumn,
} from 'typeorm';
import { OrderEntity } from '../order/order.entity';
import { RoleEntity } from '../role/role.entity';

@Entity({
  name: 'user',
})
export class UserEntity {
  // @PrimaryGeneratedColumn('uuid', {
  //   name: 'id',
  // })
  @PrimaryColumn({ select: false, generated: true, type: 'uuid', name: 'id' })
  uuid: string;

  @Column({
    name: 'image_src',
    type: 'varchar',
    nullable: true,
  })
  image_src: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'last_name',
    nullable: true,
    type: 'varchar',
  })
  last_name: string;

  @ManyToOne(() => RoleEntity, (role) => role.user)
  role: RoleEntity;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    select: false,
  })
  deleted_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPass() {
    if (!this.password) return;
    const saltRound: number = 10;
    const bcSaltRound = await genSalt(saltRound);
    this.password = await hash(this.password, bcSaltRound);
  }
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductJSON } from '@ecomm/interfaces';
import { UserEntity } from '../user/user.entity';
import { ExtraEntity } from '../extra';

@Entity({
  name: 'order',
})
export class OrderEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'cost',
    type: 'real',
    nullable: false,
  })
  cost: number;

  @Column({
    name: 'city',
    type: 'varchar',
    nullable: false,
  })
  city: string;

  @Column({
    name: 'council',
    type: 'varchar',
  })
  council: string;

  @Column({
    name: 'address',
    type: 'varchar',
    nullable: false,
  })
  address: string;

  @Column({
    name: 'status',
    type: 'smallint',
    nullable: false,
  })
  status: number;

  @Column({
    name: 'latitude',
    type: 'float',
    nullable: false,
  })
  latitude: number;

  @Column({
    name: 'longitude',
    type: 'float',
    nullable: false,
  })
  longitude: number;

  @Column({
    name: 'details',
    type: 'jsonb',
    nullable: false,
  })
  details: ProductJSON;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @ManyToMany(() => ExtraEntity)
  @JoinTable()
  products: ExtraEntity[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    select: false,
  })
  deleted_at: Date;
}

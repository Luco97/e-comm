import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterLoad,
} from 'typeorm';

import { dateType } from '@shared/utils';
import { ProductJSON } from '@ecomm/interfaces';
import { UserEntity } from '../user/user.entity';
import { ProductEntity } from '../product/product.entity';

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

  @ManyToMany(() => ProductEntity, (products) => products.orders)
  products: ProductEntity[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date;
  created_at_object?: dateType;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updated_at: Date;
  updated_at_object?: dateType;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    select: false,
  })
  deleted_at: Date;

  @AfterLoad()
  transformDate() {
    this.created_at_object = {
      day: this.created_at.getDay(),
      month: this.created_at.getMonth(),
      year: this.created_at.getFullYear(),
      hour: this.created_at.getHours(),
      minute: this.created_at.getMinutes(),
      second: this.created_at.getSeconds(),
    };
    this.updated_at_object = {
      day: this.updated_at.getDay(),
      month: this.updated_at.getMonth(),
      year: this.updated_at.getFullYear(),
      hour: this.updated_at.getHours(),
      minute: this.updated_at.getMinutes(),
      second: this.updated_at.getSeconds(),
    };
  }
}

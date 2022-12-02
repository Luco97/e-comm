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
  created_at_object?: number;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updated_at: Date;
  updated_at_object?: number;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    select: false,
  })
  deleted_at: Date;

  @AfterLoad()
  private transformDate() {
    this.created_at_object = this.created_at.getTime();
    this.updated_at_object = this.updated_at.getTime();
  }
}

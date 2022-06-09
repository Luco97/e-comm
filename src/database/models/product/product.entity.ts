import { OrderEntity } from '../order/order.entity';
import { CategoryEntity } from '../category/category.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'product',
})
export class ProductEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'image_src',
    type: 'varchar',
  })
  image_src: string;

  @Column({
    name: 'offer',
    type: 'real',
    default: 0,
  })
  offer: number;

  @Column({
    name: 'stock',
    type: 'int',
    default: 0,
  })
  stock: number;

  @Column({
    name: 'price',
    type: 'real',
    default: 0,
  })
  price: number;

  @Column({
    name: 'description',
    type: 'varchar',
  })
  description: string;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @ManyToMany(() => OrderEntity, (orders) => orders.products)
  @JoinColumn()
  orders: OrderEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  category: CategoryEntity;

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
    select: false,
  })
  deleted_at: Date;
}

import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../product/product.entity';
import { OrderEntity } from '../order';

@Entity({ name: 'variation' })
export class ExtraEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: '100',
  })
  name: string;

  @Column({ type: 'varchar', length: '400', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    length: '100',
  })
  url: string;

  @Column({
    type: 'varchar',
    array: true,
    nullable: true,
    default: [],
  })
  image_src: string[];

  @Column({ type: 'real', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 0, nullable: true })
  percent_discount: number;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({
    name: 'metadata',
    nullable: false,
    type: 'jsonb',
    default: {},
  })
  metadata: any;

  @ManyToOne(() => ProductEntity, (product) => product.extras)
  product: ProductEntity;

  // @ManyToMany(() => OrderEntity, (orders) => orders.products)
  // @JoinTable()
  // orders: OrderEntity[];

  @DeleteDateColumn({
    select: false,
  })
  deleted_at: Date;
}
